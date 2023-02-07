import express from "express";
import multer from "multer";
import File from "../models/File";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

// Create Express router
const router = express.Router();
// Multer configuration
const storage = multer.diskStorage({});

const randomWords = require("random-words");

// Multer middleware for handling file uploads
let upload = multer({
  storage,
});

// @route POST /api/files/upload
// This route is used to upload files to Cloudinary and save the file details to MongoDB
// This uses the multer middleware to handle file uploads
router.post("/upload", upload.single("myFile"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    console.log(req.file);
    let uploadedFile: UploadApiResponse;
    // Upload file to Cloudinary
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "file-sharing",
        resource_type: "auto",
      });
      // Save file details to MongoDB
      const { originalname } = req.file;
      const { secure_url, bytes, format } = uploadedFile;
      const wordPhrase = randomWords({ exactly: 3, join: " " });
      // console.log(randomWords());
      // Create new file document in MongoDB
      const file = await File.create({
        filename: originalname,
        sizeInBytes: bytes,
        phrase: wordPhrase,
        secure_url,
        format,
      });

      // Send response to client with file details and download link
      res.status(200).json({
        id: file._id,
        phrase: wordPhrase,
        downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}/download/${file._id}`,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Cloudinary Error" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File does not exist" });
    }

    const { filename, format, sizeInBytes } = file;
    return res.status(200).json({
      name: filename,
      sizeInBytes,
      format,
      id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error :(" });
  }
});

export default router;
