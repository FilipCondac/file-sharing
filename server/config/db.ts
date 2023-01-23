import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI!);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }

  const connection = mongoose.connection;
  if (connection.readyState >= 1) {
    console.log("MongoDB Connected");
    return;
  }
  connection.on("error", () => {
    console.log("MongoDB Connection Error");
  });
};

export default connectDB;
