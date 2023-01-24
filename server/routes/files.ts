import express from "express";
import multer from "multer";
import File from "../models/File";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

const router = express.Router();

const storage = multer.diskStorage({});

let upload = multer({
  storage,
});

router.post("/upload", upload.single("myFile"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    console.log(req.file);
    let uploadedFile: UploadApiResponse;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "file-sharing",
        resource_type: "auto",
      });

      const { originalname } = req.file;
      const { secure_url, bytes, format } = uploadedFile;

      const file = await File.create({
        filename: originalname,
        sizeInBytes: bytes,
        secure_url,
        format,
      });
      res.status(200).json({ message: "File uploaded", file });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Cloudinary Error" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
