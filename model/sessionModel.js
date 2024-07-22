import sessionSchema from "../schema/sessionSchema.js";

export const createSession = (sessionObj) => {
  return sessionSchema(sessionObj).save();
};
