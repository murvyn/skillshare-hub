import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAuthToken } from "../utils/helper";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password) {
      return res
        .status(401)
        .json({ message: "User does not have a password set" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = generateAuthToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Login successful", token }).status(200);
  } catch (error) {
    logger.error(`Error in login: ${(error as Error).message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
