import express from "express";
import multer from "multer";
import File from "../models/File";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import https from "https";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import dotenv from "dotenv";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig);
export const fireAuth = getAuth(fireApp);

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

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      res.status(200).json({
        status: 200,
        message: "User created successfully",
        user: user,
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      console.log(errorCode);
      return res.status(404).json({ message: "User not created", status: 404 });
    });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      res.status(200).json({
        status: 200,
        message: "User logged in successfully",
        user: user,
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      console.log(errorCode);
      return res.status(404).json({ message: "User not found", status: 404 });
    });
});

router.get("/authorizedStatus", async (req, res) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      res.status(200).json({
        status: 200,
        message: "User logged in successfully",
        user: user,
      });
      // ...
    } else {
      // User is signed out
      // ...
      return res.status(404).json({ message: "User not found", status: 404 });
    }
  });
});

router.get("/logout", async (req, res) => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      res.status(200).json({
        status: 200,
        message: "User logged out successfully",
      });
    })
    .catch((error) => {
      // An error happened.
      return res.status(404).json({ message: "User not found", status: 404 });
    });
});

export default router;
