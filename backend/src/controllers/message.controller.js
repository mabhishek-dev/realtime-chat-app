import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loginUserId = req.user._id; // Get the logged-in user's ID from the request object
    const filteredUsers = await User.find({ _id: { $ne: loginUserId } }).select(
      "fullname profilePicture",
    ); // Exclude the logged-in user from the results
    res.json(filteredUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.id; // Get the other user's ID from the route parameter
    const loginUserId = req.user._id; // Get the logged-in user's ID from the request object

    // Fetch messages between the logged-in user and the other user
    const messages = await Message.find({
      $or: [
        { senderId: loginUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loginUserId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by creation time in ascending order

    res.status(200).json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message, image } = req.body;
    const { id: receiverId } = req.params; // Get the receiver's ID from the request body
    const senderId = req.user._id; // Get the logged-in user's ID from the request object

    let imageUrl = "";
    if (image) {
      // If an image is included in the request, upload it to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "real-time-chat-app/chat-images",
      });
      imageUrl = uploadResult.secure_url; // Get the secure URL of the uploaded image
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      image: imageUrl, // Save the image URL in the message document
    });

    await newMessage.save();

    // Emit the new message to the receiver in real-time using Socket.IO
    const receiverSocketId = getReceiverSocketId(receiverId); // Get the receiver's socket ID from the in-memory map
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); // Emit the new message to the receiver's socket ID
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
