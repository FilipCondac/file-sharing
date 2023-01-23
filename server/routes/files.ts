import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({});

let upload = multer({
  storage,
});

router.post("/upload", upload.single("myFile"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    console.log(req.file);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
