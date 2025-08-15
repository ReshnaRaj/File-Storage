import { Request, Response } from "express";
import multer from "multer";
import { s3Client } from "../utils/s3Client";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { FileModel } from "../model/fileModel";
import dotenv from "dotenv";
dotenv.config();

const storage = multer.memoryStorage();
export const upload = multer({ storage });
const BUCKET_NAME = process.env.AWS_S3_BUCKET;
 
const REG=process.env.AWS_REGION
 

// @desc Upload file
// export const uploadFile = async (req: Request, res: Response) => {
//   try {
//     const file = req.file;
//     const userId = (req as any).user.userId;  
 
    

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const key = `uploads/${userId}/${Date.now()}-${file.originalname}`;

//     // Upload to S3
//     const uploadParams = {
//       Bucket: BUCKET_NAME,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     await s3Client.send(new PutObjectCommand(uploadParams));

//     // File URL
//     const url = `https://${BUCKET_NAME}.s3.${REG}.amazonaws.com/${key}`;

//     // Save in MongoDB
//     const savedFile = await FileModel.create({
//       userId,
//       url,
//       key,
//       fileName: file.originalname,
//       size: file.size,
//       mimeType: file.mimetype,
//     });

//     res.json(savedFile);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Upload failed" });
//   }
// };
export const uploadFile = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const userId = (req as any).user.userId;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const key = `uploads/${userId}/${Date.now()}-${file.originalname}`;
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3Client.send(new PutObjectCommand(uploadParams));
      const url = `https://${BUCKET_NAME}.s3.${REG}.amazonaws.com/${key}`;

      // Save each file as a separate entry in MongoDB
      const savedFile = await FileModel.create({
        userId,
        url,
        key,
        fileName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      });

      uploadedFiles.push(savedFile);
    }

    return res.status(201).json({ files: uploadedFiles, message: "Files uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc Fetch all files for a user
export const getFiles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    const files = await FileModel.find({ userId }).sort({ createdAt: -1 });
     
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching files" });
  }
};

// @desc Delete file
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const userId = (req as any).user.userId;

    const file = await FileModel.findOne({ _id: fileId, userId });
   
    if (!file) return res.status(404).json({ message: "File not found" });

    // Delete from S3
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: file.key,
    }));

    // Remove from DB
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};

// @desc Download file
export const downloadFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: file.key,
    });
   

    const s3Response = await s3Client.send(command);

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(file.fileName)}"`
    );

    // Stream the file to the response
    if (s3Response.Body && typeof s3Response.Body === "object" && "transformToWebStream" in s3Response.Body) {
      // For AWS SDK v3 in Node.js, convert to a readable stream
      const stream = s3Response.Body as any;
      stream.on("error", (err: any) => {
        res.status(500).json({ message: "Error streaming file" });
      });
      stream.pipe(res);
    } else {
      res.status(500).json({ message: "Unable to stream file" });
    }
  } catch (error) {
    res.status(500).json({ message: "Download failed" });
  }
};
