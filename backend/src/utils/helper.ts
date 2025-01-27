import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import Joi from "joi";

export const validatePassword = (data: string) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least {#limit} characters long",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
      }),
  });
  return schema.validate(data, { abortEarly: false });
};

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
