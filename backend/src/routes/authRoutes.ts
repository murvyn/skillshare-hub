import { Router } from "express";
import passport from "passport";
import { forgotPassword, login, registerUser } from "../controllers/authController";

const router = Router()

router.get("/google", passport.authenticate("google", {failureRedirect: "/login"}))
router.post("/login", login);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword)


export default router;