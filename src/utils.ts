import * as t from "io-ts";
import { reporter } from "io-ts-reporters";

export interface IFuncResponse<T> {
  errors: Array<string>;
  value: T;
}

// https://www.olioapps.com/blog/checking-types-real-world-typescript/
export function parseUnknown<T, O, I>(
  validator: t.Type<T, O, I>,
  input: I
): IFuncResponse<T | null> {
  try {
    if (typeof input === "string") input = JSON.parse(input);
  } catch {
    input = {} as I;
  }

  const result = validator.decode(input);
  const val = result.getOrElse({} as T);

  const errors = reporter(result);
  return {
    errors,
    value: errors.length === 0 ? val : null
  };
}
