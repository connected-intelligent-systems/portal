import Ajv from "ajv";
// @ts-ignore
import formats from "ajv-formats-draft2019/formats";
import tdSchema from "./td-schema.json";

let validator: any = null;

function initValidator() {
  if (validator) {
    return validator;
  }

  const ajv = new Ajv({
    strict: false,
    formats,
  });
  validator = ajv.compile(tdSchema);

  return validator;
}

export function validateThingDescription(td: any): {
  valid: boolean;
  errors?: any[];
} {
  try {
    const validate = initValidator();
    const isValid = validate(td);

    if (!isValid) {
      return {
        valid: false,
        errors: validate.errors || [],
      };
    }

    return {
      valid: true,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          message: "Failed to validate Thing Description",
          error: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}
