import express from "express";
import multer from "multer";
import File from "../models/File";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import https from "https";

// Create Express router
const router = express.Router();
// Multer configuration
const storage = multer.diskStorage({});
// Import random words package
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

      //Generate random phrase and pass to db with removed spaces
      const wordPhrase = await randomWords({ exactly: 3, join: " " });
      const dbPhrase = wordPhrase.replace(/\s/g, "");

      // Create new file document in MongoDB
      const file = await File.create({
        filename: originalname,
        sizeInBytes: bytes,
        phrase: dbPhrase,
        secure_url,
        format,
      });

      // Send response to client with file details and download link
      res.status(200).json({
        id: file._id,
        phrase: wordPhrase,
        downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}/download/id/${file._id}`,
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

// @route GET /api/files/phrase/:phrase - This route is used to get file details by phrase
//The phrase is passed in the URL and the file details are returned
router.get("/phrase/:phrase", async (req, res) => {
  try {
    const wordPhrase = req.params.phrase;
    const file = await File.find({ phrase: wordPhrase });
    if (!file) {
      return res.status(404).json({ message: "File does not exist" });
    }

    const { filename, format, sizeInBytes, id } = file[0];
    return res.status(200).json({
      name: filename,
      format,
      sizeInBytes,
      id,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server Error finding by phrase" });
  }
});

// @route GET /api/files/id/:id - This route is used to get file details by ID
//The ID is passed in the URL and the file details are returned
router.get("/id/:id", async (req, res) => {
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
    return res.status(500).json({ message: "Server Error finding by ID" });
  }
});

// @route GET /api/files/id/:id/download - This route is used to download a file. This route is used by the client to download the file
// The ID is passed in the URL and the file is downloaded
// This is used by both search by phrase and search by ID
router.get("/id/:id/download", async (req, res) => {
  try {
    const id = req.params.id;
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File does not exist" });
    }

    // Download file from Cloudinary
    let url: any = file.secure_url;
    https.get(url, (fileStream) => {
      fileStream.pipe(res);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error while trying to download file" });
  }
});

export default router;
