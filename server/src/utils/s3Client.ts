
import { S3Client } from "@aws-sdk/client-s3";
const ACCESS_KEY=process.env.AWS_ACCESS_KEY_ID!;
const SECRET_KEY=process.env.AWS_SECRET_ACCESS_KEY!;
const REGION=process.env.AWS_REGION!;

export const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});
