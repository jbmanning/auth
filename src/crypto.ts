import bcrypt from "bcryptjs";

import { SALT_ROUNDS } from "src/constants";

export const createHash = (password: string): string => {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

export const compareHash = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};
