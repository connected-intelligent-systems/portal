import Ajv from "ajv";
// @ts-ignore - ajv-formats-draft2019/formats doesn't have type definitions
import formats from "ajv-formats-draft2019/formats";
import tdSchema from "./td-schema.json";

let validator: any = null;

/**
 * Initialize the W3C Thing Description validator
 */
function initValidator() {
  if (validator) {
    return validator;
  }

  // Create Ajv instance with formats support and strict mode disabled
  // strict mode is disabled to allow unknown keywords like "version" in the W3C TD schema
  const ajv = new Ajv({
    strict: false,
    formats,
  });
  validator = ajv.compile(tdSchema);

  return validator;
}

/**
 * Validate a Thing Description against the W3C TD schema
 * @param td - The Thing Description object to validate
 * @returns Validation result with errors if validation fails
 */
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
    console.error("Validation error:", error);
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
