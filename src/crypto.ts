import { genSaltSync, hashSync, compareSync } from "bcryptjs";

import { SALT_ROUNDS } from "src/constants";

export const createHash = (password: string): string => {
  const salt = genSaltSync(SALT_ROUNDS);
  return hashSync(password, salt);
};

export const compareHash = (password: string, hash: string): boolean => {
  return compareSync(password, hash);
};
