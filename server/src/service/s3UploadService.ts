import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../utils/s3Client";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const BUCKET_NAME=process.env.AWS_BUCKET_NAME as string;
const AWS_REGION=process.env.AWS_REGION as string;
 
export const uploadFileToS3 = async (file,fileName) => {
  // Create a unique file name
  const fileExtension = path.extname(file.originalname);
  const key = `${uuidv4()}${fileExtension}`;

 
  const params = {
    Bucket:BUCKET_NAME , 
    Key: key,
    Body: file,
    ContentType: "image/jpeg,png,jpg,application/pdf,application/msword",
  };

  // Upload to S3
  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  // Return file URL
  return `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
};
