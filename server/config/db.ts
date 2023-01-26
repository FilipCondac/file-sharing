import mongoose from "mongoose";

// MongoDB Connection
const connectDB = async () => {
  try {
    //Connect to Mongo using provided URI and setting options
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }
  // Check if connection is successful
  const connection = mongoose.connection;
  if (connection.readyState >= 1) {
    console.log("MongoDB Connected");
    return;
  }
  // If connection is not successful
  connection.on("error", () => {
    console.log("MongoDB Connection Error");
  });
};

export default connectDB;
