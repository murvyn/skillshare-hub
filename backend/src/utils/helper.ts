import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import crypto from "crypto";

export const generateAuthToken = (user: User) => {
  const jwtPrivateKey = process.env.JWTPrivateKey;

  if (!jwtPrivateKey) {
    throw new Error("JWTPrivateKey environment variable not set");
  }
  const expiresIn = "24h";
  return jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      photoUrl: user.photoUrl,
      googleId: user.googleId,
    },
    jwtPrivateKey,
    { expiresIn }
  );
};
export const getNewChallenge = () => {
  return Math.random().toString(36).substring(2);
};
export const convertChallenge = (challenge: string) => {
  return btoa(challenge).replaceAll("=", "");
};
