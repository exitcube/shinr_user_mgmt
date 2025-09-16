import Joi from "joi";

export type ValidationResult = { success: boolean; errors?: string };

// Generic validation function that takes schema and data as parameters
export function validatePayload(schema: Joi.ObjectSchema, data: any): ValidationResult {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    return { success: false, errors: error.message };
  }
  return { success: true };
}