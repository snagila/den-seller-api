import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectToMongoDb } from "./config/dbConfig.js";
import { userRouter } from "./routers/userRouter.js";

const app = express();
const PORT = process.env.PORT || 8000;

// middlewares
app.use(cors());
app.use(express.json());

// connect to database
connectToMongoDb();

// routes
app.use("/api/user", userRouter);

// run the server
app.listen(PORT, (error) => {
  error ? console.log(error) : console.log("Server is running at ", PORT);
});
