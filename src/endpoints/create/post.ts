import { APIGatewayProxyHandler } from "aws-lambda";

import { createUser, userCreationParams } from "src/dataEngine";
import { parseUnknown } from "src/utils";

const handler: APIGatewayProxyHandler = async (event) => {
  let { errors, value: body } = parseUnknown(userCreationParams, event.body);

  if (errors.length === 0) {
    if (body === null) {
      errors.push("failed parsing input");
    } else {
      const userCreationErrors = await createUser(body);
      errors = errors.concat(userCreationErrors);

      if (errors.length === 0 && process.env.STAGE === "prod") {
        console.warn("IMPLEMENT MG VALIDATION");
      }
    }
  }

  return {
    statusCode: errors.length === 0 ? 200 : 400,
    body: JSON.stringify({
      errors: errors,
      success: errors.length === 0
    })
  };
};

export { handler };
