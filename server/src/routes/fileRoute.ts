import express from "express";
import { upload, uploadFile, getFiles, deleteFile } from "../controller/fileController";
import { authMiddleware } from "../middleWare/authMiddleware";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/getFiles", authMiddleware, getFiles);
router.delete("/del-files/:fileId", authMiddleware, deleteFile);

export default router;
