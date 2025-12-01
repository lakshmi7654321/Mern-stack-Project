import express from "express";
import {
  addMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";

const router = express.Router();

router.post("/", addMenuItem);

router.get("/", getAllMenuItems);

router.get("/:id", getMenuItemById);

router.put("/:id", updateMenuItem);


router.delete("/:id", deleteMenuItem);

export default router;
