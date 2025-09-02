import Joi from "joi";

export type ValidationResult = { success: boolean; errors?: string[] };

//login validation
export const loginValidate = Joi.object({
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
});

export const otpValidate = Joi.object({
  otpToken: Joi.string().required().messages({
    "string.empty": "OTP token is required",
  }),
  otp: Joi.string().length(4).required().messages({
    "string.empty": "OTP is required",
    "string.length": "OTP must be a 4-digit string",
  }),
});


// Validators map
export const validators: Record<string, Joi.ObjectSchema> = {
  login: loginValidate,
  otp: otpValidate,
};

// Global validation function
export function ValidationFunction(type: string, data: any): ValidationResult {
  const schema = validators[type];
  if (!schema) {
    return { success: false, errors: [`No validator found for type: ${type}`] };
  }

  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    return { success: false, errors: error.details.map((e) => e.message) };
  }

  return { success: true };
}
