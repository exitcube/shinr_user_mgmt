import Joi from 'joi';

export const reverseGeocodeValidate = {
    body: Joi.object({
      lat: Joi.number()
        .required()
        .messages({
          "any.required": "Latitude is required",
          "number.base": "Latitude must be a valid number",
        }),
      lng: Joi.number()
        .required()
        .messages({
          "any.required": "Longitude is required",
          "number.base": "Longitude must be a valid number",
        }),
    }),
  };

