import { PrismaClient, User } from "@prisma/client";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import "dotenv";
import { generateAuthToken } from "./helper";
import { logger } from "./logger";

const prisma = new PrismaClient();

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || profile.emails.length === 0) {
          return done(null, false, {
            message: "Email is not available in the Google profile.",
          });
        }
        const user = await prisma.user.findUnique({
          where: {
            email: profile.emails[0].value,
          },
        });

        const isLogin = request.query?.state === "true";

        if (isLogin) {
          if (!user) {
            return done(null, false, {
              message: "User not found. Please sign up.",
            });
          }
          if (!user.googleId) {
            return done(null, false, {
              message: "User not found. Please sign up.",
            });
          }
          if (user.googleId && user.googleId !== profile.id) {
            return done(null, false, {
              message: "Google account does not match. Please sign up.",
            });
          }
          return done(null, user);
        }

        if (!user) {
          return done(null, false, {
            message: "User not found. Please sign up.",
          });
        }
        const updatedUser = await prisma.user.update({
          where: { email: user.email },
          data: {
            photoUrl:
              user.photoUrl ??
              (profile.photos ? profile.photos[0].value : null),
            googleId: profile.id,
          },
        });

        return done(null, updatedUser);
      } catch (error) {
        logger.error(error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user: User, done) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    done(null, currentUser);
  } catch (error) {
    logger.error(error);
    done(error);
  }
});
