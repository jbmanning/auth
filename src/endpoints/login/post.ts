import { APIGatewayProxyHandler } from "aws-lambda";
import * as t from "io-ts";

import { getUser, IUser } from "src/dataEngine";
import { parseUnknown } from "src/utils";
import { compareHash } from "src/crypto";

const loginSchema = t.type({
  email: t.string,
  password: t.string
});

const rawHandler: APIGatewayProxyHandler = async (event) => {
  let { errors: bodyErrors, value: body } = parseUnknown(loginSchema, event.body);
  if (bodyErrors.length > 0 || body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: ["invalid_parameters"]
      })
    };
  }

  const { errors: deErrors, value: user } = await getUser(body.email);
  if (deErrors.length > 0) {
    console.log("DE FAILURE");
    console.log(deErrors);
    return {
      statusCode: 500,
      body: JSON.stringify({
        errors: ["data_engine_failure"]
      })
    };
  }

  if (user && compareHash(body.password, user.hash)) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        errors: [],
        name: user.name
      })
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({
        errors: ["bad_credentials"]
      })
    };
  }
};

const errBody = {
  statusCode: 500,
  body: JSON.stringify({
    errors: ["internal_error"]
  })
};

const handler: APIGatewayProxyHandler = async (event, context, cb) => {
  const raw = (await rawHandler(event, context, cb)) || errBody;
  return {
    ...raw,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    }
  };
};

export { handler };
