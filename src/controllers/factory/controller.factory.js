import {
  PutItemCommand,
  DeleteItemCommand,
  BatchWriteItemCommand,
  BatchGetItemCommand,
  UpdateItemCommand,
  ScanCommand,
  QueryCommand
} from "@aws-sdk/client-dynamodb";

import {
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

import {
  S3Client,
  GetObjectCommand
} from "@aws-sdk/client-s3";

import { log_error } from '../../libs/utils.js';

import { success, redirect_temporary } from '../../libs/res.js';

import _ from 'lodash';

import {
  v4 as Guid
} from 'uuid';

import {
  marshall,
  unmarshall
} from "@aws-sdk/util-dynamodb";

import client from '../../libs/dynamo.js';

export function create(validator) {
  return async function (event) {
    try {
      const body = JSON.parse(event.body);
      validator(body);
      if (body) {
        const PartitionKey = body.PK || `${process.env.DATA_TYPE}-${Guid()}`;
        const SortKey = body.PK ? `${process.env.DATA_TYPE}-${Guid()}` : 'meta';
        const ContentType = SortKey === 'meta' ? 'meta' : process.env.DATA_TYPE;

        const { relations = {}, ...entity } = body;

        const item = {
          ...entity,
          _type: ContentType,
          PK: PartitionKey,
          SK: SortKey
        }

        const params = {
          Item: marshall(item, {
            removeUndefinedValues: true
          }),
          ReturnConsumedCapacity: "TOTAL",
          TableName: process.env.TABLE_NAME
        };

        await client.send(new PutItemCommand(params));

        const purified = [];

        const pushPrimaryRelation = (item, key) => {
          purified.push({
            ...item,
            _type: key,
            PK: PartitionKey,
            SK: `${key}-${Guid()}`
          })
        }

        const pushPartialRelation = (item, key) => {
          purified.push({
            PK: PartitionKey,
            SK: `${key}-${Guid()}`,
            GSI1: item
          })
        }


        _.keys(relations).forEach(function(key) {
          if(_.isArray(relations[key])) {
            relations[key].forEach((relation) => {
              if (_.isObject(relation)) {
                pushPrimaryRelation(relation, key)
              } else if (_.isString(relation)) {
                pushPartialRelation(relation, key)
              }
            })
          } else {
            if (_.isObject(relations[key])) {
              pushPrimaryRelation(relations[key], key)
            } else if (_.isString(relations[key])) {
              pushPartialRelation(relations[key], key)
            }
          }
        });

        if(purified.length) {
          const batch = {
            RequestItems: {
              [process.env.TABLE_NAME]: purified.map((item) => ({
                PutRequest: {
                  Item: marshall(item, {
                    removeUndefinedValues: true
                  })
                }
              }))
            }
          }

          await client.send(new BatchWriteItemCommand(batch));
        }

        client.destroy();

        return success(item)
      } else {
        return log_error({
          error: "Payload is empty for this request.",
        })
      }
    } catch (error) {
      return log_error(error.message);
    }
  };
}

export function update(validator) {
  return async (event) => {
    try {
      const body = JSON.parse(event.body);
      const PartitionKey = event.pathParameters['PK'];
      const SortKey = event.pathParameters['SK'];

      if(event.queryStringParameters && _.has(event.queryStringParameters , 'relation')) {
        return await _update(PartitionKey, SortKey, body)
      }

      validator(body);

      if (body.PK && body.PK !== PartitionKey) {
        return log_error("Primary key is immutable")
      }

      if (body.SK && body.SK !== SortKey) {
        return log_error("Sort key is immutable")
      }

      const keys = Object.keys(body);

      if(!keys.length) {
        return log_error({
          error: "Payload is empty for this request.",
        })
      }

      const { Attributes } = await client.send(new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: marshall({
          PK: PartitionKey,
          SK: SortKey
        }),
        ReturnValues: 'ALL_NEW',
        UpdateExpression: `SET ${keys.map((k, index) => `#field${index} = :value${index}`).join(', ')}`,
        ExpressionAttributeNames: keys.reduce((accumulator, k, index) => ({ ...accumulator, [`#field${index}`]: k }), {}),
        ExpressionAttributeValues: marshall(keys.reduce((accumulator, k, index) => ({ ...accumulator, [`:value${index}`]: body[k] }), {})),
      }));

      client.destroy();
      return success(unmarshall(Attributes));
    } catch (error) {
      return log_error(error);
    }
  }
}

async function _update(PartitionKey, SortKey, params) {
  try {
    if (!PartitionKey || !SortKey) {
      return log_error("Primary/Sort key is missing while updating relation")
    }

    if(!params.GSI1) {
      return log_error({
        error: "Relation key is empty for this request.",
      })
    }

    const { Attributes } = await client.send(new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: marshall({
        PK: PartitionKey,
        SK: SortKey
      }),
      ReturnValues: 'ALL_NEW',
      UpdateExpression: "set GSI1 = :GSI1",
      ExpressionAttributeValues: marshall({
        ':GSI1': params.GSI1
      })
    }));

    client.destroy();
    return success(unmarshall(Attributes));
  } catch (error) {
    return log_error(error);
  }
}

export function get() {
  return async (event) => {
    try {

      if (!event.pathParameters || !event.pathParameters['PK']) {
        return log_error({
          error: `Primary key for ${process.env.DATA_TYPE} is required`,
        })
      }

      const PartitionKey = event.pathParameters['PK'];
      const SortKey = event.queryStringParameters ? event.queryStringParameters['SK'] : false;

      const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: marshall({
          ':pk': PartitionKey
        })
      };

      if(SortKey) {
        params.KeyConditionExpression += ' AND begins_with(SK, :sk)'
        params.ExpressionAttributeValues = {
          ...params.ExpressionAttributeValues,
          ...marshall({
            ':sk': SortKey
          })
        }
      }

      const { Items } = await client.send(new QueryCommand(params));
      let Data = Items.map(unmarshall);

      const Relations = Data.filter((item) => !_.has(item, '_type'));

      if(Relations.length) {

        const batchParamsForRelation = {
          RequestItems: {
            [process.env.TABLE_NAME]: {
              Keys: Relations.map((item) => marshall({ PK: item.GSI1, SK: 'meta'}))
            }
          }
        }

        const { Responses } = await client.send(new BatchGetItemCommand(batchParamsForRelation));
        Data = [
          ...Data,
          ...(Responses[process.env.TABLE_NAME].map(i => unmarshall(i)))
        ];
      }

      const ItemIndex = Data.findIndex((i) => {
        return i.PK === PartitionKey && _.has(i, '_type') && i.SK === 'meta';
      });

      if(ItemIndex === -1) {
        return log_error({
          error: `Could not find ${process.env.DATA_TYPE} with id ${PartitionKey}`,
        })
      }

      let Response = {...Data[ItemIndex]}
      Data.splice(ItemIndex, 1);
      Response.relations = Data.filter((i) => !_.has(i, 'GSI1'));
      Response._map = Data.filter((i) => _.has(i, 'GSI1'));

      client.destroy();

      return success(Response);

    } catch (error) {
      return log_error(error);
    }
  }
}

export function getAll() {
  return async (event) => {
    try {
      const command = {
        TableName: process.env.TABLE_NAME,
        FilterExpression: "begins_with(PK, :pk) AND SK = :sk",
        ExpressionAttributeValues: marshall({
          ':pk': process.env.DATA_TYPE,
          ':sk': 'meta'
        })
      };

      const { Count, Items } = await client.send(new ScanCommand(command));

      return success(Items.map(unmarshall), {
        'X-Total-Count': Count
      });

    } catch (error) {
      return log_error(error);
    }
  }
}

export function remove() {
  return async (event) => {
    try {
      const PartitionKey = event.pathParameters['PK']
      const SortKey = event.pathParameters['SK']

      const params = {
        Key: marshall({
          PK: PartitionKey,
          SK: SortKey
        }),
        TableName: process.env.TABLE_NAME
      }

      const command = new DeleteItemCommand(params);
      const { Item } = await client.send(command);

      client.destroy();

      return success({
        message: 'Ok',
        data: Item
      })

    } catch (error) {
      console.log('error', error);
      return log_error(error);
    }
  }
}

export async function redirect(event, context) {
  const type = event.queryStringParameters['type'];

  const buckets = {
    asset: `vod-assets-${process.env.STAGE}`,
    preview: `vod-preview-${process.env.STAGE}`,
    video: `vod-output-${process.env.STAGE}`,
  };

  const bucket = buckets[type];
  let key = decodeURIComponent(event.queryStringParameters['key'])

  if(type === 'video') {
    const uuid = key.split('.')[0];
    key = `${uuid}/hls/${uuid}.m3u8`
  }

  const s3client = new S3Client({
    region: process.env.REGION,
  });
  const params = {
    Bucket: bucket,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  const signedUrlExpireSeconds = 60 * 60 * 1; //1h
  const signedURL = await getSignedUrl(s3client, command, {
    expiresIn: signedUrlExpireSeconds
  });
  return redirect_temporary(signedURL);
}
