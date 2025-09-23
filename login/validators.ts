import Joi from 'joi';

export const loginValidate = {
  body: Joi.object({
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        'string.empty': 'Mobile number is required',
        'string.pattern.base': 'Mobile number must be 10 digits',
      }),
  }),
  query: Joi.object({}), // empty object schema for query
};