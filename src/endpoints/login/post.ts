import { APIGatewayProxyHandler } from "aws-lambda";
import * as t from "io-ts";

import { createUser } from "src/dataEngine";
import { parseUnknown } from "src/utils";

const inputSchema = t.type({
  email: t.string,
  password: t.string
});

const handler: APIGatewayProxyHandler = async (event) => {
  let { errors, value: body } = parseUnknown(inputSchema, event.body);

  if (errors.length === 0) {
    if (body === null) {
      errors.push("failed parsing input");
    } else {
      const userCreationErrors = await createUser(body.email, body.password);
      errors = errors.concat(userCreationErrors);

      if (process.env.STAGE === "prod") {
        console.warn("IMPLEMENT MG VALIDATION");
      }
    }
  }

  return {
    statusCode: errors.length === 0 ? 400 : 200,
    body: JSON.stringify({
      errors: errors,
      success: errors.length === 0
    })
  };
};

export { handler };
