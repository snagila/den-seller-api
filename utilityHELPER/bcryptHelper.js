import bcrypt from "bcryptjs";

export const hashPassword = (plain_password) => {
  const salt = 5;
  const hashPassword = bcrypt.hashSync(plain_password, salt);
  return hashPassword;
};

export const comparePassword = (plain_password, encryptedPassword) => {
  return bcrypt.compareSync(plain_password, encryptedPassword);
};
