import express from "express";
import { loginWithCode } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginWithCode);

export default router;
