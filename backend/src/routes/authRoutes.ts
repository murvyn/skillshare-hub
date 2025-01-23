import { Router } from "express";
import passport from "passport";
import { forgotPassword, login, registerUser } from "../controllers/authController";
import { loginFinish, loginStart, registerStart } from "../controllers/passkeyController";
const {registerFinish} = require('../controllers/passkey.cjs')

const router = Router()

router.get("/google", passport.authenticate("google", {failureRedirect: "/login"}))
router.post("/login", login);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword)
router.post("/passkey-login/start", loginStart)
router.post("/passkey-login/finish", loginFinish)
router.post("/passkey-register/start", registerStart)
router.post("/passkey-register/finish", registerFinish)


export default router;