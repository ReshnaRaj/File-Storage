import { Request, Response } from "express";
import multer from "multer";
import { s3Client } from "../utils/s3Client";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { FileModel } from "../model/fileModel";
import dotenv from "dotenv";
dotenv.config();

const storage = multer.memoryStorage();
export const upload = multer({ storage });

// @desc Upload file
export const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const userId = (req as any).user.id; // Assuming you set req.user in auth middleware

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const key = `uploads/${userId}/${Date.now()}-${file.originalname}`;

    // Upload to S3
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // File URL
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`;

    // Save in MongoDB
    const savedFile = await FileModel.create({
      userId,
      url,
      key,
      fileName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    });

    res.json(savedFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// @desc Fetch all files for a user
export const getFiles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
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
    const userId = (req as any).user.id;

    const file = await FileModel.findOne({ _id: fileId, userId });
    if (!file) return res.status(404).json({ message: "File not found" });

    // Delete from S3
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
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
