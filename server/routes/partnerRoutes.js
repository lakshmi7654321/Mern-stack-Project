import express from "express";
import { createPartner, getAllPartners, updatePartner, deletePartner } from "../controllers/partnerController.js";

const router = express.Router();

router.post("/", createPartner);
router.get("/", getAllPartners);
router.put("/:id", updatePartner);
router.delete("/:id", deletePartner);

export default router;
