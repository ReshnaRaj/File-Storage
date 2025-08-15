import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  userId: string;
  url: string;
  key: string;
  fileName: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

const FileSchema = new Schema<IFile>(
  {
    userId: { type: String, required: true },
    url: { type: String, required: true },
    key: { type: String, required: true },
    fileName: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true }
  },
  { timestamps: true }
);

export const FileModel = mongoose.model<IFile>("File", FileSchema);
