import express from "express";
import helmet from "helmet";
import compression from "compression";

const app = express();

app.use(helmet())
app.use(compression())
app.use(express.json());

const port = 5000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})