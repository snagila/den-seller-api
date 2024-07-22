// Database query regarding to the users

import userSchema from "../schema/userSchema.js";

// create a user
export const createUser = (userObj) => {
  return userSchema(userObj).save();
};
