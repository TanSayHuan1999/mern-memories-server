import express from "express";
import { signIn, signUp, googleSignIn } from "../controllers/users.js";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/google-sign-in", googleSignIn);
router.post("/sign-up", signUp);

export default router;
