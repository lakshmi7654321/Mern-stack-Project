import express from "express";
import {
  createContact,
  getAllContacts,
  deleteContact,
  updateContact,
  replyToContact
} from "../controllers/contactController.js";

const router = express.Router();

// Create contact message
router.post("/", createContact);

// Get all messages
router.get("/", getAllContacts);

// Delete a message
router.delete("/:id", deleteContact);

// Update message (optional: edit name/email/message)
router.put("/:id", updateContact);

// Reply to a message (admin)
router.put("/reply/:id", replyToContact);

export default router;
