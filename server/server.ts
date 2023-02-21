import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import fileRoute from "./routes/files";
import { v2 as cloudinary } from "cloudinary";
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// Create Express server
const app = express();

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
connectDB();

// Express configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/files", fileRoute);

const PORT = process.env.PORT;

//Listen on port
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
