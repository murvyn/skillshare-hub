import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import crypto from "crypto";

export const generateAuthToken = (user: User) => {
  const jwtPrivateKey = process.env.JWTPrivateKey;

  if (!jwtPrivateKey) {
    throw new Error("JWTPrivateKey environment variable not set");
  }
  return jwt.sign(user, jwtPrivateKey);
};
export const getNewChallenge = () => {
  return crypto.randomBytes(32).toString("base64url");
}
// export const convertChallenge = (challenge: string) => {
//   return btoa(challenge).replaceAll('=', '');
// }