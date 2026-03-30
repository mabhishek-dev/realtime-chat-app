import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import connectDB from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
dotenv.config();

app.use(express.json({ limit: "10mb" })); // Middleware to parse JSON bodies from incoming requests, with a size limit of 10mb to prevent abuse
app.use(express.urlencoded({ extended: true, limit: "10mb" })); //Middleware enables parsing of URL-encoded request bodies with a 10MB size limit and extended syntax support.
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies to be sent in cross-origin requests
  }),
);
app.use(cookieParser()); // Middleware to parse cookies from incoming requests, i.e to access the token cookie for authentication in protected routes via req.cookies(.token/anyCookieName))
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const port = process.env.PORT || 5001;
const __dirname = path.resolve(); // Get the absolute path to the current directory so that we can serve the frontend files correctly in production at the  same place where the backend files are located, i.e in the root directory of the project

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Serve static files from the frontend's dist directory in production
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

server.listen(port, () => console.log(`Server running on port ${port}...`));
