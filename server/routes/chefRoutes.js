import express from "express";
import {
  createChef,
  getAllChefs,
  updateChef,
  deleteChef,
} from "../controllers/chefController.js";

const router = express.Router();

// Create new chef
router.post("/", createChef);

// Get all chefs
router.get("/", getAllChefs);

// Update chef
router.put("/:id", updateChef);

// Delete chef
router.delete("/:id", deleteChef);

export default router;
