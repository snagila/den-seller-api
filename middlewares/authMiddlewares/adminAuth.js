import { findUserByEmail } from "../../model/userModel.js";
import { verifyAccessJWT } from "../../utilityHELPER/jwtHelper.js";
import { buildErrorResponse } from "../../utilityHELPER/responseHelper.js";

export const adminAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // validate accessJWT
    const decoded = verifyAccessJWT(authorization);

    if (decoded?.email) {
      const user = await findUserByEmail(decoded.email);

      if (user?.isVerified && user?._id && user?.role === "admin") {
        (user.password = undefined), (req.userInfo = user);
        return next();
      }
    }
    throw new Error("Invalid token, unauthorized");
  } catch (error) {
    buildErrorResponse(res, error.message || "Invalid token");
  }
};
