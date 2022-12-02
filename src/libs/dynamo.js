import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
const region = process.env.AWS_REGION || 'eu-west-2'

const options = { region };

if(process.env.STAGE == 'dev') {
  options.endpoint = 'http://192.168.1.103:8000/'
}

const client = new DynamoDBClient(options);

export default client
