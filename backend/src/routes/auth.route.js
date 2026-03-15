import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup); // New route for user registration
router.post("/login", login); // New route for user login
router.post("/logout", logout); // New route for user logout

router.put("/update-profile", protectRoute, updateProfile); // New route to update profile picture with authentication

router.get("/check-auth", protectRoute, checkAuth); // New route to check authentication status after page refresh to take user to the home page if already logged in or else to the login page

export default router;
