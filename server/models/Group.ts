import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

// Create Schema for File
const groupSchema = new Schema(
  {
    groupname: {
      type: String,
      required: true,
    },
    phrase: {
      type: String,
      required: true,
    },
    members: {
      type: Array,
      required: true,
    },
    membersDisplay: {
      type: Array,
      required: true,
    },
    files: {
      type: Array,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create interface for File
interface IGroup extends Document {
  groupname: String;
  phrase: String;
  members: Array<String>;
  membersDisplay: Array<String>;
  files: Array<String>;
  creator: String;
}

export default mongoose.model<IGroup>("Group", groupSchema);
