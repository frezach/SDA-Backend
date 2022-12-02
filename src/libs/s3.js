import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION || 'us-east-1'
const options = { region };
const client = new S3Client(options);

export default client;
