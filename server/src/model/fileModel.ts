import mongoose, { Document, Schema, Types } from "mongoose";
interface File extends Document {
  owner: Types.ObjectId;
  originalName: string;
  key: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}
const fileSchema = new Schema<File>({
  owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
  originalName: { type: String, required: true },
  key: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<File>("file", fileSchema);
