import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export const generateAuthToken = (user: User) => {
  const jwtPrivateKey = process.env.JWTPrivateKey;

  if (!jwtPrivateKey) {
    throw new Error("JWTPrivateKey environment variable not set");
  }
  return jwt.sign(user, jwtPrivateKey);
};
