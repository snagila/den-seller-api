import jwt from "jsonwebtoken";
import { createSession } from "../model/sessionModel.js";
import { updateUser } from "../model/userModel.js";

// replace secret keys with JWT_ACCESS_SECRET for access JWT
// replace secret keys with JWT_REFRESH_SECRET for access JWT

// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// access jwt: session table, exp:15min
export const generateAccessJWT = (email) => {
  const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  createSession({ token, userEmail: email });
  console.log(token);
  return token;
};

// refreshtoken JWT: user table, exp:30days
export const generateRefreshJWT = (email) => {
  const token = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
  updateUser({ email }, { refreshJWT: token });
  return token;
};

// generate token
export const generateJWTs = (email) => {
  return {
    accessJWT: generateAccessJWT(email),
    refreshJWT: generateRefreshJWT(email),
  };
};

// verify accessJWT
export const verifyAccessJWT = (accessJWT) => {
  return jwt.verify(accessJWT, process.env.JWT_ACCESS_SECRET);
};

// verify refreshJWT
export const verifyRefreshJWT = (refreshJWT) => {
  return jwt.verify(refreshJWT, process.env.JWT_REFRESH_SECRET);
};
