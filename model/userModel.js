// Database query regarding to the users

import userSchema from "../schema/userSchema.js";

// create a user
export const createUser = (userObj) => {
  return userSchema(userObj).save();
};

// update an user
export const updateUser = (findBy, updatePart) => {
  return userSchema.findOneAndUpdate(findBy, updatePart, { new: true });
};

// find an user using email
export const findUserByEmail = (email) => {
  return userSchema.findOne({ email });
};
