import { Router } from "express";
import passport from "passport";
import { login, registerUser } from "../controllers/authController";

const router = Router()

router.get("/google", passport.authenticate("google", {failureRedirect: "/login"}))
router.post("/login", login);
router.post("/register", registerUser);

export default router;