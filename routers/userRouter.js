import express from "express";
import { newUserValidation } from "../middlewares/validationMiddlewares/userValidation.js";
import { hashPassword } from "../utilityHELPER/bcryptHelper.js";
import { createUser } from "../model/userModel.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utilityHELPER/responseHelper.js";

export const userRouter = express.Router();

// CREATE USER || POST PUBLIC
userRouter.post("/", newUserValidation, async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = hashPassword(password);
    console.log(hashedPassword);
    const user = await createUser({ ...req.body, password: hashedPassword });

    user?._id
      ? buildSuccessResponse(
          res,
          {},
          "Check your inbox/spam to verify your email"
        )
      : buildErrorResponse(res, "Could not register the user");
  } catch (error) {
    if (error.code === 11000) {
      error.message = "User with this email already exists!!";
    }

    buildErrorResponse(res, error.message);
  }
});
