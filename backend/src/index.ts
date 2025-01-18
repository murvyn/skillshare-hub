import express from "express";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import passport from "passport";
import auth from "./routes/authRoutes";
import "dotenv/config"
import { PrismaClient } from "@prisma/client";
import { getInterest } from "./controllers/interestsController";
import cors, {CorsOptions} from "cors"
import { getUser } from "./controllers/authController";
const prisma = new PrismaClient();

const app = express();
const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
}

app.use(helmet());
app.use(compression());
app.use(cors(corsOptions))
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", auth);
app.get("/api/interests", getInterest)
app.get("/api/user", getUser)

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
