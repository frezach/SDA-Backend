import { ElementalJob } from "./job.js";
import { CreateJobCommand } from '@aws-sdk/client-mediaconvert';
import { client } from './mediaconvert.js';

import {
  log_error
} from '../../libs/utils.js';

export async function transcodingHandler (event, context) {
  try {
    const sourceS3Bucket = event.Records[0].s3.bucket.name;
    const sourceS3Key = event.Records[0].s3.object.key;
    const dd = sourceS3Key.includes('.') ? sourceS3Key.split('.')[0] : 'default';
    const mediaConvertRole = process.env.MEDIA_CONVERT_ROLE_ARN;
    const jobMetadata = { 'assetID': sourceS3Key }

    const config = { ...ElementalJob };
    config.Queue = process.env.MEDIA_CONVERT_QUEUE_ARN;
    config.Settings.Inputs[0].FileInput = `s3://${ sourceS3Bucket }/${ sourceS3Key }`;
    config.Settings.OutputGroups[0].OutputGroupSettings.HlsGroupSettings.Destination = `s3://${ process.env.OUTPUT_BUCKET }/${dd}/hls/`;
    // config.Settings.OutputGroups[0].OutputGroupSettings.FileGroupSettings.Destination = `s3://${ process.env.OUTPUT_BUCKET }/mp4/`;
    config.Role = mediaConvertRole;
    config.UserMetadata = jobMetadata;

    const data = await client.send(new CreateJobCommand(config))

    console.log(`Job::Created ${JSON.stringify(data)}`);
  } catch (error) {
    console.log(error);
    return log_error(error);
  }
}
