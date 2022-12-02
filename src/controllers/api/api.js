import {
  BatchGetItemCommand,
  QueryCommand,
  ScanCommand
} from "@aws-sdk/client-dynamodb";

import { log_error } from '../../libs/utils.js';

import { success } from '../../libs/res.js';

import _ from 'lodash';

import {
  marshall,
  unmarshall
} from "@aws-sdk/util-dynamodb";

import client from '../../libs/dynamo.js';
import { whitelist } from './datatype.js';
import { get, getAll } from '../factory/controller.factory.js';
import { getLiked, setLiked } from "./api.factory.js";

export async function getHomeScreenData(event, context) {
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      FilterExpression: 'begins_with (PK, :pk)',
      ExpressionAttributeValues: marshall({
        ':pk' : 'set'
      }),
    };

    const { Items } = await client.send(new ScanCommand(params));
    let Data = Items.map(unmarshall);


    const Relations = Data.filter((item) => !_.has(item, '_type'));
    Data = Data.filter((item) => _.has(item, '_type'));
    const RelatedKeys = [...new Set(Relations.map(i => i.GSI1))];

    if(RelatedKeys.length) {

      const batchParamsForRelation = {
        RequestItems: {
          [process.env.TABLE_NAME]: {
            Keys: RelatedKeys.map((item) => marshall({ PK: item, SK: 'meta'}))
          }
        }
      }

      const { Responses } = await client.send(new BatchGetItemCommand(batchParamsForRelation));
      const Unmarshalled = Responses[process.env.TABLE_NAME].map(i => unmarshall(i))

      for(const Item of Data) {
        let RequiredKeys = Relations.filter((i) => {
          return !_.has(i, '_type') && i.PK === Item.PK
        });
        RequiredKeys = RequiredKeys.map((i) => i.GSI1)

        Item.videos = Unmarshalled.filter((i) => {
          return RequiredKeys.includes(i.PK)
        })
      }
    }

    client.destroy();

    return success(Data);

  } catch (e) {
    console.log(JSON.stringify(e));
    log_error(e)
  }
}

export async function getAllByDataType (event, context) {

  const type = event.pathParameters['type'];

  if(!whitelist.includes(type)) {
    console.log(`User API Query to non-whitelisted data type ${type}`);
    log_error(e)
  }

  process.env.DATA_TYPE = type

  return await getAll()(event);
}

export async function getSingleItem (event, context) {

  const type = event.pathParameters['type'];

  if(!whitelist.includes(type)) {
    console.log(`User API Query to non-whitelisted data type ${type}`);
    log_error(e)
  }

  process.env.DATA_TYPE = type

  return await get()(event);
}
