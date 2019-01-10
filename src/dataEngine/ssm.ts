import { SSM } from "aws-sdk";
import { printErrors } from "src/dataEngine/utils";

const manager = new SSM();

export const getParameter = async (
  name: string,
  decrypt: boolean = true
): Promise<string> => {
  const param = await manager
    .getParameter({
      Name: name,
      WithDecryption: decrypt
    })
    .promise()
    .then((data) => {
      if (data.Parameter === undefined) return null;
      return data.Parameter;
    })
    .catch((err) => {
      printErrors(err);
      return null;
    });

  if (param === null || param.Value === undefined) {
    return "";
  } else {
    return param.Value;
  }
};
