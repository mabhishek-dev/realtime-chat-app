import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar); // New route to get users for sidebar with authentication
router.get("/:id", protectRoute, getMessages); // New route to get messages between logged-in user and another user with authentication
router.post("/send/:id", protectRoute, sendMessage); // New route to send a message with authentication

export default router;
