import { DynamoDB } from "aws-sdk";
import * as t from "io-ts";

import * as crypto from "src/crypto";
import { IFuncResponse, parseUnknown } from "src/utils";
import * as dataUtils from "src/dataEngine/utils";

const dynamo = new DynamoDB();
const converter = DynamoDB.Converter;

const defaultDBParams = {
  TableName: process.env.TABLE_NAME || ""
};

const userSchema = t.type({
  email: t.string,
  hash: t.string,
  active: t.boolean
});

type IUser = t.TypeOf<typeof userSchema>;

export const getUser = async (
  rawEmail: string,
  options = {}
): Promise<IFuncResponse<IUser | null>> => {
  const email = rawEmail.toLowerCase();

  let errors = dataUtils.validateEmail(email);
  if (errors.length > 0) {
    return {
      errors,
      value: null
    };
  }

  const dbParams = {
    ...defaultDBParams,
    Key: {
      email: converter.input(email)
    },
    ...options
  };

  let rawUser;
  try {
    rawUser = await dynamo
      .getItem(dbParams)
      .promise()
      .then((data) => {
        if (!data.Item) return null;
        return converter.unmarshall(data.Item);
      })
      .catch((err) => {
        dataUtils.printErrors(err);
        throw err;
      });
  } catch (err) {
    return {
      errors: ["failed to fetch user"],
      value: null
    };
  }

  let user: IUser | null;
  if (rawUser) {
    let { errors: userErrors, value } = parseUnknown(userSchema, rawUser);
    if (userErrors.length > 0) errors = errors.concat(userErrors);
    user = value;
  } else {
    user = null;
  }

  return {
    errors,
    value: errors.length === 0 ? user : null
  };
};

export const createUser = async (
  rawEmail: string,
  password: string
): Promise<Array<string>> => {
  const email = rawEmail.toLowerCase();

  const emailErrors = dataUtils.validateEmail(email);
  const passwordErrors = dataUtils.validatePassword(password);
  const { errors: getUserErrors, value: oldUser } = await getUser(email);
  if (getUserErrors.length > 0) return ["failed to check email was not taken"];

  const errors = emailErrors.concat(passwordErrors);
  if (oldUser && oldUser.email === email) {
    errors.push("Email is already taken");
  }

  if (errors.length > 0) return errors;

  const dbParams = {
    ...defaultDBParams,
    ConditionExpression: "attribute_not_exists(email)",
    Item: converter.marshall({
      email: email,
      hash: crypto.createHash(password),
      active: false
    })
  };

  const creationErrors = await dynamo
    .putItem(dbParams)
    .promise()
    .then(() => {
      return [];
    })
    .catch((error) => {
      dataUtils.printErrors(error);
      // tslint:disable:no-magic-numbers
      if (error.statusCode === 400) {
        return ["Email is already taken"];
      } else {
        return ["unknown creation error"];
      }
    });

  return errors.concat(creationErrors);
};
