import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import fileRoute from "./routes/files";

const app = express();

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/files", fileRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
