import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export function getReceiverSocketId(receiverId) {
  return userSocketMap[receiverId]; // Return the socket ID for the given receiver ID from the in-memory map
}

// In-memory map to track online users and their corresponding socket IDs
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  const userId = socket.handshake.query.userId; // Get user ID from query parameters
  if (userId) {
    userSocketMap[userId] = socket.id; // Map user ID to socket ID
    console.log(`User ${userId} connected with socket ID ${socket.id}`);

    // Emit the updated list of online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.warn("No user ID provided in socket connection query parameters");
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
    delete userSocketMap[userId]; // Remove the user from the map when they disconnect
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the updated list of online users to all connected clients
  });
});

export { io, app, server };
