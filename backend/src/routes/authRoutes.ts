import { Router } from "express";
import passport from "passport";
import {
  forgotPassword,
  login,
  registerUser,
  resetPasswordGet,
  resetPasswordPost,
} from "../controllers/authController";
import { loginStart, registerStart, registerFinish, loginFinish } from "../controllers/passkeyController";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { failureRedirect: "/login" })
);
router.post("/login", login);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.post("/passkey-login/start", loginStart);
router.post("/passkey-login/finish", loginFinish);
router.post("/passkey-register/start", registerStart);
router.post("/passkey-register/finish", registerFinish);
router.get("/reset-password/:id/:token", resetPasswordGet);
router.post("/reset-password/:id/:token", resetPasswordPost);

export default router;
