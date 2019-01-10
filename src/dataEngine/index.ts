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

  const rawUser = await dynamo
    .getItem(dbParams)
    .promise()
    .then((data) => {
      if (!data.Item) return null;
      return converter.unmarshall(data.Item || {});
    })
    .catch((error) => {
      dataUtils.printErrors(error);
      return null;
    });

  if (!rawUser) {
    errors.push("failed to fetch user");

    return {
      errors,
      value: null
    };
  } else {
    const { errors: userErrors, value: user } = parseUnknown(userSchema, rawUser);
    if (userErrors.length > 0) errors = errors.concat(userErrors);

    return {
      errors,
      value: user
    };
  }
};

export const createUser = async (
  rawEmail: string,
  password: string
): Promise<Array<string>> => {
  const email = rawEmail.toLowerCase();

  const emailErrors = dataUtils.validateEmail(email);
  const passwordErrors = dataUtils.validatePassword(password);
  const { value: oldUser } = await getUser(email);

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
