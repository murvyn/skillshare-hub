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
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res
        .status(401)
        .json({ message: "User does not have a password set" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
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

export const getUser = async (req: Request, res: Response) => {
  try {
    await prisma.userInterest.deleteMany({
      where: { userId: "989c8489-de12-4278-a9d1-677018e6d63f" },
    });
    const user = await prisma.user.delete({
      where: { id: "989c8489-de12-4278-a9d1-677018e6d63f" },
    });
    res.json(user).status(200);
  } catch (error) {
    logger.error(`Error in getting user: ${(error as Error).message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { firstName, lastName, email, password, interests, role } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        photoUrl: null,
        googleId: null,
        interests: {
          create: interests.map((interestId: string) => ({
            interest: { connect: { id: interestId } },
          })),
        },
      },
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    logger.error(`Error in user registration: ${(error as Error).message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
