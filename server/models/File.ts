import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

// Create Schema for File
const fileSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    phrase: {
      type: String,
      required: true,
    },
    displayPhrase: {
      type: String,
      required: true,
    },
    sizeInBytes: {
      type: Number,
      required: true,
    },
    creator: {
      type: String,
    },
    sender: {
      type: String,
    },
    group: {
      type: String,
    },
    receiver: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create interface for File
interface IFile extends Document {
  filename: String;
  secure_url: String;
  format: String;
  phrase: String;
  displayPhrase: String;
  sizeInBytes: String;
  creator: String;
  sender?: String;
  group?: String;
  receiver?: String;
}

export default mongoose.model<IFile>("File", fileSchema);
