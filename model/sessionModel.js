import sessionSchema from "../schema/sessionSchema.js";

export const createSession = (sessionObj) => {
  return sessionSchema(sessionObj).save();
};

export const deleteSession = (filter) => {
  return sessionSchema.findOneAndDelete(filter);
};

export const deletePreviousSessionToken = (filter) => {
  return sessionSchema.deleteMany(filter);
};
