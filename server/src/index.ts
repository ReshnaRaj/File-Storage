import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import path from "path";
dotenv.config();
import dbConnection from "./config/dbConnection"
import authRoute from "./routes/authRoute";
import fileRoute from "./routes/fileRoute";
const app = express();
 
app.use(cors({
    origin:process.env.BASE_URL,
    methods:['POST','GET','PUT','DELETE'],
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoute);
app.use('/api/files',fileRoute)
dbConnection()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
     
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB error.");
  });