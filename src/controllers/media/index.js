import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";

import {
  getSignedUrl
} from "@aws-sdk/s3-request-presigner";

import {
  log_error,
} from '../../libs/utils.js';

import {
  success,
  redirect_temporary
} from '../../libs/res.js';

import {
  create,
  buckets
} from "../../schemas/media.schema.js";

export async function getS3SignedURL(event) {
  try {
    const body = JSON.parse(event.body);
    if (body) {

      create(body);

      const options = {
        region: process.env.REGION,
      }

      if(process.env.STAGE === 'dev') {
        options.endpoint = `http://${process.env.LOCAL_STACK_HOSTNAME}:4566`;
        options.s3ForcePathStyle = true;
      }

      const s3client = new S3Client(options);
      const signedUrlExpireSeconds = 60 * 60 * 1; //1h

      const sign = async (media) => {
        const Key = decodeURIComponent(media.file)
        const Bucket = buckets[media.type]

        console.log(`Requesting upload ${Key} to ${Bucket}`);

        const params = {
          Bucket,
          Key,
          ContentType: 'application/octet-stream',
          ACL: 'private'
        };

        const command = new PutObjectCommand(params);

        const upload = await getSignedUrl(s3client, command, {
          expiresIn: signedUrlExpireSeconds
        });

        return {
          ...media,
          upload
        }
      }

      if(Array.isArray(body)) {
        const items = [];
        for (const media of body) {
          const i = await sign(media);
          items.push(i)
        }
        return success(items);
      } else {
        const j = await sign(body);
        return success(j);
      }
    } else {
      return log_error({
        error: "Payload is empty for this request.",
      })
    }
  } catch (error) {
    console.log(error);
    return log_error(error);
  }
}

export async function getS3RedirectURL(event) {
  const filekey = event.pathParameters['filekey']
  const s3client = new S3Client({
    region: process.env.REGION,
  });
  const params = {
    Bucket: process.env.BUCKET,
    Key: filekey,
  };
  const command = new GetObjectCommand(params);
  const signedUrlExpireSeconds = 60 * 60 * 1; //1h
  const signedURL = await getSignedUrl(s3client, command, {
    expiresIn: signedUrlExpireSeconds
  });

  return redirect_temporary(signedURL);

}
