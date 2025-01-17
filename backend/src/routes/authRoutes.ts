import { Router } from "express";
import passport from "passport";
import { login } from "../controllers/authController";

const router = Router()

router.get("/google", passport.authenticate("google", {failureRedirect: "/login"}))
router.post("/login", login);

export default router;