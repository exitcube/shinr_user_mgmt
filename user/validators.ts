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

export const  autoSearchingValidate = {
  query: Joi.object({
      search: Joi.string()
        .min(3) // minimum 3 characters
        .required()
        .messages({
          "string.base": " must be a string",
          "string.empty": " cannot be empty",
          "string.min": "must be at least 3 characters long",
          "any.required": "search is required"
        }),
    }),
};