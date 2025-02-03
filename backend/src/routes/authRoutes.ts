import { Router } from "express";
import passport from "passport";
import {
  forgotPassword,
  login,
  registerUser,
  resetPasswordGet,
  resetPasswordPost,
} from "../controllers/authController";
import {
  loginStart,
  registerStart,
  registerFinish,
  loginFinish,
} from "../controllers/passkeyController";
import { generateAuthToken } from "../utils/helper";
import { User } from "@prisma/client";

const router = Router();

router.get(
  "/google",
  (req, res, next) => {
    const isLogin = req.query.isLogin === "true" ? "true" : "false";

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: isLogin, 
    })(req, res, next);
  }
);
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err: string, user: User, info: {message: string}) => {
      if (err || !user) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/login?error=${encodeURIComponent(
            info?.message || "Google authentication failed"
          )}`
        );
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return res.redirect(
            `${process.env.FRONTEND_URL}/auth/login?error=${encodeURIComponent(
              "Login failed. Please try again."
            )}`
          );
        }
        const token = generateAuthToken(user as User);
        res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
      });
    })(req, res, next);
  }
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
