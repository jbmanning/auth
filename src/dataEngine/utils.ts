import { red } from "colors";
import zxcvbn from "zxcvbn";

// import topologies from "src/dataEngine/topology.json";
const topologies = [];
import { PWD_MIN_LENGTH, PWD_MAX_LENGTH } from "../constants";
import * as ssm from "src/dataEngine/ssm";

const levDist = (a: string, b: string): number => {
  let t: Array<number> = [];
  let u: Array<number> = [];
  let i: number;
  let j: number;

  const m = a.length;
  const n = b.length;

  if (!m) {
    return n;
  }
  if (!n) {
    return m;
  }

  for (j = 0; j <= n; j++) {
    t[j] = j;
  }
  for (i = 1; i <= m; i++) {
    // tslint:disable:ban-comma-operator
    for (u = [i], j = 1; j <= n; j++) {
      u[j] = a[i - 1] === b[j - 1] ? t[j - 1] : Math.min(t[j - 1], t[j], u[j - 1]) + 1;
    }
    t = u;
  }
  return u[n];
};

const getTopology = (str: string) => {
  const lowerRe = /[a-z]/g;
  const upperRe = /[A-Z]/g;
  const numericRe = /[0-9]/g;
  const specialRe = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g;

  return str
    .replace(lowerRe, "l")
    .replace(upperRe, "u")
    .replace(numericRe, "d")
    .replace(specialRe, "s");
};

export const validateEmail = (email: string): Array<string> => {
  const errors: Array<string> = [];

  // regex validation
  const preReg = /(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/;
  if (!preReg.test(email)) {
    errors.push("Email is malformed or contains invalid characters");
  }

  return errors;
};

export const validatePassword = (password: string): Array<string> => {
  const errors: Array<string> = [];

  // char length 8-72
  if (password.length < PWD_MIN_LENGTH) {
    errors.push(`Password must be ${PWD_MIN_LENGTH} characters or more`);
  }

  if (password.length > PWD_MAX_LENGTH) {
    errors.push(`Use ${PWD_MAX_LENGTH} characters or fewer for your password`);
  }

  // dropbox zxcvbn status
  const zxStatus = zxcvbn(password);
  if (zxStatus.score < 3) {
    zxStatus.feedback.suggestions.map((item) => {
      errors.push(item);
    });
  }

  // topology
  const pwdTopology = getTopology(password);
  for (const commonTopology of topologies) {
    if (levDist(pwdTopology, commonTopology) <= 2) {
      errors.push("Your password is similar to common password topologies");
      break;
    }
  }

  // Custom rules
  // TODO: pwdTop must have 2+ types
  // TODO: No repeating characters (eg. 111)

  return errors;
};

// TODO: Figure out permissions for these.
// const certPrivate = ssm.getParameter(process.env.SSM_PRIVATE_KEY_NAME || "");
// const certPublic = ssm.getParameter(process.env.SSM_PUBLIC_KEY_NAME || "");

const printError = (err) => {
  console.log(red(`${err.code}:`), `${err.message}`);
};

export const printErrors = (error) => {
  if (!error) {
    return;
  }

  const errs = error.errors;
  if (errs && errs.length > 0) {
    for (const err of errs) {
      printError(err);
    }
  } else {
    printError(error);
  }
};
