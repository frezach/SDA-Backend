import { MediaConvertClient } from "@aws-sdk/client-mediaconvert";
const config = { endpoint: process.env.MEDIA_CONVERT_ENDPOINT };
export const client = new MediaConvertClient(config);
