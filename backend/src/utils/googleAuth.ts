import { PrismaClient, User } from "@prisma/client";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv";
import { generateAuthToken } from "./helper";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) =>  {
      try {
        if (!profile.emails || profile.emails.length === 0 ) {
          return done(new Error("Email is not available in the Google profile."));
        }
        let user = await prisma.user.findUnique({
          where: {
            email: profile.emails[0].value,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              firstName: profile.name?.givenName as string,
              lastName: profile.name?.familyName as string,
              email: profile.emails[0].value,
              photoUrl: profile.photos ? profile.photos[0].value : null,
              googleId: profile.id,
            },
          });
        }
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    console.error(error);
    done(error);
  }
});
