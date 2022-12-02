import {
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

import { log_error, validate_joi_result } from '../../libs/utils.js';

import { success } from '../../libs/res.js';

import _ from 'lodash';

import {
  marshall,
  unmarshall
} from "@aws-sdk/util-dynamodb";

import {
  v4 as Guid
} from 'uuid';

import client from '../../libs/dynamo.js';
import { like } from "./api.schema.js";
import { whitelistForLike } from "./datatype.js";

const checkDataTypeExistInPath = (event, act) => {
  if(!event.pathParameters['datatype']) {
    console.log(`Like:: path parameter datatype not provided while ${act}`);
    log_error({ message: 'datatype path parameter missing' })
  }

  if(!whitelistForLike.includes(event.pathParameters['datatype'])) {
    console.log(`Like:: path parameter not whitelisted in ${act}`);
    log_error({ message: 'datatype is not allowed to like' })
  }
}

export async function getLiked (event, context) {
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: marshall({
        ':pk': context.identity.cognitoIdentityId,
        ':sk': `liked-${event.pathParameters['datatype']}`
      })
    };

    const { Items } = await client.send(new QueryCommand(params));
    client.destroy();
    return success(Items.map(unmarshall));
  } catch (e) {
    console.log(JSON.stringify(e));
    log_error(e)
  }
}

export async function setLiked (event, context) {
  try {
    checkDataTypeExistInPath(event, 'create');

    const body = JSON.parse(event.body);
    validate_joi_result(like.validate(body));

    const item = {
      PK: context.identity.cognitoIdentityId,
      SK: `liked-${event.pathParameters['datatype']}-${Guid()}`,
      [datatype]: body.id
    }

    const params = {
      Item: marshall(item, {
        removeUndefinedValues: true
      }),
      ReturnConsumedCapacity: "TOTAL",
      TableName: process.env.TABLE_NAME
    };

    await client.send(new PutItemCommand(params));
    client.destroy();

    return success({ message: `${datatype} has been liked` });
  } catch (e) {
    console.log(JSON.stringify(e));
    log_error(e)
  }
}

export async function removeLiked (event, context) {
  try {
    checkDataTypeExistInPath(event, 'remove');

    const body = JSON.parse(event.body);
    validate_joi_result(like.validate(body));

    const params = {
      Key: marshall({
        PK: context.identity.cognitoIdentityId,
        SK: body.id
      }),
      TableName: process.env.TABLE_NAME
    }

    const command = new DeleteItemCommand(params);
    await client.send(command);
    client.destroy();

    return success({ message: `liked ${datatype} has been removed` });
  } catch (e) {
    console.log(JSON.stringify(e));
    log_error(e)
  }
}

export async function create(event, context) {
  try {
    const body = JSON.parse(event.body);
    validate_joi_result(like.validate(body));

    const item = {
      PK: context.identity.cognitoIdentityId,
      SK: `${event.pathParameters['datatype']}-${Guid()}`,
      [datatype]: body.id
    }

    const params = {
      Item: marshall(item, {
        removeUndefinedValues: true
      }),
      ReturnConsumedCapacity: "TOTAL",
      TableName: process.env.TABLE_NAME
    };

    await client.send(new PutItemCommand(params));
    client.destroy();

    return success({ message: `${datatype} has been liked` });
  } catch (e) {
    console.log(JSON.stringify(e));
    log_error(e)
  }
}
