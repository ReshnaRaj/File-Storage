import mongoose from "mongoose";
const MONGO_URL = process.env.MONGODB_URL;
const dbconnection = async () => {
  try {
    mongoose
      .connect(MONGO_URL as string, {})
      .then(() => {
        console.log("Database is connected");
      })
      .catch((err) => {
        console.log("database error", err.message);
      });
  } catch (error) {
    console.log(error, "dataase");
  }
};

export default dbconnection;
