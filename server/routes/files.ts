import express from "express";
import multer from "multer";
import File from "../models/File";
import Group from "../models/Group";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import https from "https";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  // GoogleAuthProvider,
  deleteUser,
  sendPasswordResetEmail,
  // signInWithPopup,
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
const admin = require("firebase-admin");

// const provider = new GoogleAuthProvider();
// provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
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

      const auth = getAuth();
      let userID = "";
      if (auth.currentUser) {
        userID = auth.currentUser.uid;
      }

      // Create new file document in MongoDB
      const file = await File.create({
        filename: originalname,
        sizeInBytes: bytes,
        displayPhrase: wordPhrase,
        phrase: dbPhrase,
        creator: userID,
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

// @route POST /api/files/groupUpload
router.post("/groupUpload", upload.single("myFile"), async (req, res) => {
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
      const { groupID } = req.body;

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
        group: groupID,
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

// @route GET /api/files/getFilesByGroup/:groupID - This route is used to get file details by group
router.get("/getFilesByGroup/:groupID", async (req, res) => {
  try {
    const groupID = req.params.groupID;
    const file = await File.find({ group: groupID });
    if (!file) {
      return res.status(404).json({ message: "File does not exist" });
    }

    return res.status(200).json({
      files: file,
    });
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

// @route POST /api/files/register - This route is used to register a user
router.post("/register", async (req, res) => {
  const { email, password, displayName } = req.body;

  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      updateProfile(user, { displayName: displayName })
        .then(() => {
          console.log("User display name set successfully");
          res.status(200).json({
            status: 200,
            message: "User created successfully",
            user: user,
          });
        })
        .catch((error) => {
          console.log("Error setting user display name:", error.message);
          res.status(500).json({
            status: 500,
            message: "Error setting user display name",
          });
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

// @route POST /api/files/login - This route is used to login a user
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

// @route GET /api/files/authorizedStatus - This route is used to check if a user is logged in
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

// @route GET /api/files/logout - This route is used to logout a user
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

// @route POST /api/files/updateAccount - This route is used to update a user's account
router.post("/updateAccount", async (req, res) => {
  const { displayName, email, password } = req.body;
  const auth = getAuth();
  if (auth.currentUser) {
    if (displayName !== "") {
      updateProfile(auth.currentUser, {
        displayName: displayName,
      })
        .then(() => {
          res.status(200).json({
            status: 200,
            message: "User display updated successfully",
          });
        })
        .catch((error) => {
          // An error occurred
          // ...
        });
    }

    if (email !== "") {
      updateEmail(auth.currentUser, email)
        .then(() => {
          res.status(200).json({
            status: 200,
            message: "User emailupdated successfully",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (password !== "") {
      updatePassword(auth.currentUser, password)
        .then(() => {
          res.status(200).json({
            status: 200,
            message: "User password updated successfully",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } else {
    return res.status(404).json({ message: "User not found", status: 404 });
  }
});

// @route POST /api/files/deleteAccount - This route is used to delete a user's account
router.post("/deleteAccount", async (req, res) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    deleteUser(user)
      .then(() => {
        // User deleted.
        res.status(200).json({
          status: 200,
          message: "User deleted successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(404).json({ message: "User not found", status: 404 });
      });
  } else {
    return res.status(404).json({ message: "User not found", status: 404 });
  }
});

// @route POST /api/files/resetPassword - This route is used to reset a user's password
router.post("/resetPassword", async (req, res) => {
  const { email } = req.body;
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("Password reset email sent successfully");
      res.status(200).json({
        status: 200,
        message: "Password reset email sent successfully",
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

// @route POST /api/files/createGroup - This route is used to create a group
router.post("/createGroup", async (req, res) => {
  const { groupName } = req.body;
  const wordPhrase = await randomWords({ exactly: 3, join: " " });

  const auth = getAuth();
  const creator = auth.currentUser?.uid;
  const creatorDisplayName = auth.currentUser?.displayName;
  try {
    const group = await Group.create({
      groupname: groupName,
      phrase: wordPhrase,
      members: [creator],
      membersDisplay: [creatorDisplayName],
      creator: creator,
    });
    console.log(group);
    return res.status(200).json({
      phrase: wordPhrase,
      message: "Group created successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server Error while trying to create group" });
  }
});

// @route GET /api/files/getUserGroups - This route is used to get all the groups a user is a part of
router.get("/getUserGroups", async (req, res) => {
  const auth = getAuth();
  const user = auth.currentUser?.uid;
  try {
    const groups = await Group.find({ members: user });
    console.log(groups);
    return res.status(200).json({ groups: groups, status: 200 });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server Error while trying to get groups" });
  }
});

// @route POST /api/files/joinGroup - This route is used to join a group
router.post("/joinGroup", async (req, res) => {
  const { phrase } = req.body;
  const auth = getAuth();
  const user = auth.currentUser?.uid;
  const userDisplayName = auth.currentUser?.displayName;
  try {
    // Find the document with the given phrase and add the user ID to the "members" array
    const group = await Group.findOneAndUpdate(
      { phrase: phrase },
      { $addToSet: { members: user, membersDisplay: userDisplayName } },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({
        message: "Group not found with the provided phrase",
        status: 404,
      });
    }

    return res
      .status(200)
      .json({ message: "User added to group successfully", status: 200 });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server Error while trying to join group" });
  }
});

// @route GET /api/files/group/:groupID - This route is used to get a group by ID
router.get("/group/:groupID", async (req, res) => {
  try {
    const id = req.params.groupID;
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group does not exist" });
    }

    const { groupname, phrase, members, files, creator, membersDisplay } =
      group;
    return res.status(200).json({
      name: groupname,
      phrase: phrase,
      members: members,
      membersDisplay: membersDisplay,
      files: files,
      creator,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error finding group by ID" });
  }
});

router.post("/getUsername", async (req, res) => {
  // Retrieve user IDs from query string
  const { members } = req.body;

  console.log(members);
  if (Array.isArray(members)) {
    const displayNames = members.map((uid) =>
      admin
        .auth()
        .getUser(uid)
        .then((user: any) => user.displayName)
    );
    Promise.all(displayNames)
      .then((displayNames) => {
        console.log(displayNames);
        res.status(200).json(displayNames);
      })
      .catch((error) => {
        console.log("Error getting users:", error);
        res.status(500).json({ error: "Unable to retrieve display names." });
      });
  } else {
    res.status(400).json({ error: "Invalid request parameters." });
  }
});

router.delete("/deleteGroup/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) {
      return res.status(404).json({ message: "Group does not exist" });
    }

    return res.status(200).json({
      message: "Group deleted successfully",
      deletedGroup: deletedGroup,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error deleting group by ID" });
  }
});

router.post("/leaveGroup", async (req, res) => {
  const { groupID } = req.body;
  const auth = getAuth();

  const user = auth.currentUser?.uid;
  const userDisplayName = auth.currentUser?.displayName;
  try {
    // Find the group by ID
    const group = await Group.findById(groupID);

    // Check if group exists
    if (!group) {
      return res.status(404).json({ message: "Group does not exist" });
    }

    // Check if user is a member of the group
    if (user) {
      const isMember = group.members.includes(user);
      if (!isMember) {
        return res
          .status(400)
          .json({ message: "You are not a member of this group" });
      }
    }

    // Remove the user from the group's members array
    const updatedGroup = await Group.findByIdAndUpdate(
      groupID,
      { $pull: { members: user, membersDisplay: userDisplayName } },
      { new: true }
    );

    return res.status(200).json({
      message: "You have left the group",
      group: updatedGroup,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

router.get("/getUserFiles", async (req, res) => {
  const auth = getAuth();
  const user = auth.currentUser?.uid;

  if (!user) {
    return res.status(200).json({ files: [], status: 401 });
  } else {
    try {
      const files = await File.find({ creator: user });
      console.log(files);
      return res.status(200).json({ files: files, status: 200 });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Server Error while trying to get files" });
    }
  }
});

export default router;
