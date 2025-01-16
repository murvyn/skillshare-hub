import { Router } from "express";
import passport from "passport";

const router = Router()

router.get("/auth/google", passport.authenticate("google", {failureRedirect: "/login"}), )