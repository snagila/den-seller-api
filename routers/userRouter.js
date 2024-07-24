import express from "express";
import { newUserValidation } from "../middlewares/validationMiddlewares/userValidation.js";
import { hashPassword } from "../utilityHELPER/bcryptHelper.js";
import { v4 as uuidv4 } from "uuid";
import { createUser, updateUser } from "../model/userModel.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utilityHELPER/responseHelper.js";
import { createSession, deleteSession } from "../model/sessionModel.js";
import {
  sendAccountVerifiedEmail,
  sendVerificationLinkEmail,
} from "../utilityHELPER/nodemailerHelper.js";

export const userRouter = express.Router();

// CREATE USER || POST PUBLIC
userRouter.post("/", newUserValidation, async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = hashPassword(password);
    const user = await createUser({ ...req.body, password: hashedPassword });

    if (user?._id) {
      // if user is created send a verification email
      const secureID = uuidv4();

      //   store this secure ID in session storage for that user
      const newUserSession = await createSession({
        userEmail: user.email,
        token: secureID,
      });

      if (newUserSession?._id) {
        // create verification link and send verification email
        const verificationUrl = `${process.env.CLIENT_ROOT_URL}/verify-email?e=${user.email}&id=${secureID}`;

        // send the email
        sendVerificationLinkEmail(user, verificationUrl);
      }
    }

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

// VERIFY USER
userRouter.post("/verify-email", async (req, res) => {
  try {
    const { token, userEmail } = req.body;
    if (userEmail && token) {
      const result = await deleteSession({ token, userEmail });

      if (result?._id) {
        // update the user to isVerified True
        const user = await updateUser(
          { email: userEmail },
          { isVerified: true }
        );

        if (user._id) {
          // send account verified email and welcome email
          sendAccountVerifiedEmail(user, process.env.CLIENT_ROOT_URL);
          buildSuccessResponse(res, {}, "Your email is verified.");
          return;
        }
      }
      return;
    }
    buildErrorResponse(
      res,
      "Account can not be verified. Please contact admin. "
    );
  } catch (error) {
    buildErrorResponse(
      res,
      "Account can not be verified. Please contact admin. "
    );
  }
});
