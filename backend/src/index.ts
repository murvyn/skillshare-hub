import express from "express";
import helmet from "helmet";
import compression from "compression";
import session from "express-session"

const app = express();

app.use(helmet())
app.use(compression())
app.use(express.json());
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

const port = 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})