import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

// [A1] What — Auth routes — Why — expose register/login — Result: mounted under /api/auth

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;


