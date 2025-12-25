import express from "express";
import {
  createMessage,
  getMessages,
  deleteMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", createMessage);        // Client contact form
router.get("/", getMessages);           // Admin dashboard
router.delete("/:id", deleteMessage);   // Delete message

export default router;
