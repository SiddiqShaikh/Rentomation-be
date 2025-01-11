import express from "express";
import {
  getMessages,
  addMessage,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Routes
router.get("/messages", verifyJWT, getMessages); // Get all messages for the verifyJWTd user
router.post("/messages", verifyJWT, addMessage); // Add a new message
router.put("/messages/:id", verifyJWT, updateMessage); // Update message (e.g., mark as read)
router.delete("/messages/:id", verifyJWT, deleteMessage); // Delete message by ID

export default router;
