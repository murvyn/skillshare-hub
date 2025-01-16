import { PrismaClient } from "@prisma/client";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken"
import "dotenv";

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
              photo: profile.photos[0].value,
              googleId: profile.id,
            },
          });
        }
        const token = jwt.sign(
          {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            photoUrl: user.photoUrl,
          },
          process.env.JWT_PRIVATE_KEY,
          { expiresIn: "1h" }
        );

        return done(null, { token });
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

passport.deserializeUser(async (id, done) => {
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
