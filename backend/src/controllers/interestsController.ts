import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getInterest = async (req: Request, res: Response) => {
  try {
    const interests = await prisma.interest.findMany();
    res.json(interests).status(200);
  } catch (error) {
    console.error(`Error in user registration: ${(error as Error).message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
