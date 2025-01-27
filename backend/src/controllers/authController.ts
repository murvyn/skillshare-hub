import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAuthToken, validatePassword } from "../utils/helper";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";

const prisma = new PrismaClient();
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { interests: { include: { interest: true } } },
    });
    if (!user) {
      return res
        .status(404)
        .json({
          message: "User not found. Would you like to create an account?",
        });
    }

    if (!user.password) {
      return res
        .status(401)
        .json({ message: "User does not have a password set" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateAuthToken(user);
    res.cookie("auth-x-token", token, {
      httpOnly: false,
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
      return res.status(409).json({ message: "User already exists" });
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
    const token = generateAuthToken(newUser);
    res.cookie("auth-x-token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    logger.error(`Error in user registration: ${(error as Error).message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({
          message: "User not found. Would you like to create an account?",
        });
    }

    const secret = process.env.JWTPrivateKey! + user.password;
    const token = jwt.sign({ email: user.email, id: user.id }, secret, {
      expiresIn: "5m",
    });
    const link = `${process.env.FRONTEND_URL}/auth/reset-password/${user.id}/${token}`;

    const transporter = createTransport({
      service: "gmail",
      host: "stmp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDRESS!,
        pass: process.env.EMAIL_PASSWORD!,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const emailOptions = {
      from: process.env.EMAIL_ADDRESS!,
      to: user.email,
      subject: "Reset Password",
      html: `
      <p>Hello ${user.firstName || "User"},</p>
      <p>We received a request to reset the password for your account. Please click the link below to reset your password:</p>
      <a href="${link}">Reset Password</a>
      <p>This link will expire in 5 minutes for security reasons. If you didn't request this password reset, you can safely ignore this email.</p>
      <p>Thank you,<br>SKILLSHARE HUB Team</p>
    `,
    };

    await transporter.sendMail(emailOptions);
    res.json({ message: "Password reset link sent" }).status(200);
  } catch (error) {
    logger.error(`Error in forgot password: ${(error as Error).message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPasswordGet = async (req: Request, res: Response): Promise<any> => {
  const { id, token } = req.params;
  console.log(id, token)
  if (!id || !token) {
    return res.status(400).json({ message: "Invalid id or token" });
  }
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const secret = process.env.JWTPrivateKey! + user.password;
  try {
    const verify = jwt.verify(token, secret);
    res
      .json({ message: "Password reset link is valid", user: verify })
      .status(200);
  } catch (error) {
    logger.error(`Error in reset password: ${(error as Error).message}`);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const resetPasswordPost = async (req: Request, res: Response): Promise<any> => {
  const { id, token } = req.params;
  if (!id || !token) {
    return res.status(400).json({ message: "Invalid id or token" });
  }
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  const { error } = validatePassword(password);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const secret = process.env.JWTPrivateKey! + user.password;
  try {
    const verify = jwt.verify(token, secret);
    if (!verify) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    res.json({ message: "Password reset successful" }).status(200);
  } catch (error) {
    logger.error(`Error in reset password: ${(error as Error).message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
