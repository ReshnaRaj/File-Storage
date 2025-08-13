import mongoose, { Document, Schema,Types } from "mongoose";
interface User extends Document {
    _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
}
const userSchema = new Schema<User>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model<User>('user',userSchema);
