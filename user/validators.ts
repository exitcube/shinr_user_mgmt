import Joi from 'joi';

export const reverseGeocodeValidate = {
  body: Joi.object({
    lat: Joi.string()
      .required()
      .messages({
        "any.required": "Latitude is required",
        "string.base": "Latitude must be a valid string",
      }),
    lng: Joi.string()
      .required()
      .messages({
        "any.required": "Longitude is required",
        "string.base": "Longitude must be a valid string",
      }),
  }),
};

