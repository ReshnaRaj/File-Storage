import express from "express";
import { upload, uploadFile, getFiles, deleteFile, downloadFile } from "../controller/fileController";
import { authMiddleware } from "../middleWare/authMiddleware";

const router = express.Router();

router.post("/upload", authMiddleware, upload.array("files"), uploadFile);
router.get("/getFiles", authMiddleware, getFiles);
router.delete("/del-files/:fileId",authMiddleware, deleteFile);
router.get("/download/:fileId", authMiddleware, downloadFile);

export default router;
