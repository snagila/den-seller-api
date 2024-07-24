import express from "express";
import { newUserValidation } from "../middlewares/validationMiddlewares/userValidation.js";
import {
  comparePassword,
  hashPassword,
} from "../utilityHELPER/bcryptHelper.js";
import { v4 as uuidv4 } from "uuid";
import { createUser, findUserByEmail, updateUser } from "../model/userModel.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utilityHELPER/responseHelper.js";
import {
  createSession,
  deletePreviousSessionToken,
  deleteSession,
} from "../model/sessionModel.js";
import {
  sendAccountVerifiedEmail,
  sendVerificationLinkEmail,
} from "../utilityHELPER/nodemailerHelper.js";
import { adminAuth } from "../middlewares/authMiddlewares/adminAuth.js";
import {
  generateAccessJWT,
  generateJWTs,
  verifyRefreshJWT,
} from "../utilityHELPER/jwtHelper.js";

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

// Login user

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER BY EMAIL

    const user = await findUserByEmail(email);

    if (!user?._id) {
      return buildErrorResponse(res, "User Account does not exists.");
    }

    if (!user?.isVerified) {
      return buildErrorResponse(
        res,
        "User is not verified. Please check your email for verification."
      );
    }

    if (user?.role !== "admin") {
      return buildErrorResponse(
        res,
        "You are not authorised to access this app."
      );
    }

    const isPassWordMatched = comparePassword(password, user.password);

    if (isPassWordMatched) {
      const jwts = generateJWTs(user.email);
      return buildSuccessResponse(res, jwts, "Logged in Successfully.");
    }
  } catch (error) {
    buildErrorResponse(res, error.message);
  }
});

// GET THE USER
userRouter.get("/", adminAuth, async (req, res) => {
  try {
    buildSuccessResponse(res, req.userInfo, "User Info");
  } catch (error) {
    buildErrorResponse(res, error.message);
  }
});

// NEW ACCESS TOKEN WITH REFRESH TOKEN
userRouter.post("/accessJWT", async (req, res) => {
  try {
    const { authorization } = req.headers;

    const verifedRefreshJWT = verifyRefreshJWT(authorization);

    if (verifedRefreshJWT?.email) {
      const deletePreviousSession = await deletePreviousSessionToken({
        userEmail: verifedRefreshJWT.email,
      });

      const accessJWT = generateAccessJWT(verifedRefreshJWT.email);
      const newAccessToken = await createSession({
        userEmail: verifedRefreshJWT.email,
        token: accessJWT,
      });

      return buildSuccessResponse(res, accessJWT, "New Token");
    }
  } catch (error) {
    buildErrorResponse(res, error.message);
  }
});
