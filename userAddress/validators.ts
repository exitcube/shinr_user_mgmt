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



export const addAddressValidate = {
  body: Joi.object({
    nickName: Joi.string().trim().allow('', null).optional()
      .messages({
        'string.base': 'nickName must be a string',
      }),
    name: Joi.string().trim().required()
      .messages({
        'any.required': 'name is required',
        'string.empty': 'name cannot be empty',
        'string.base': 'name must be a string',
      }),
    addressLine1: Joi.string().trim().required()
      .messages({
        'any.required': 'addressLine1 is required',
        'string.empty': 'addressLine1 cannot be empty',
        'string.base': 'addressLine1 must be a string',
      }),
    country: Joi.string().trim().required()
      .messages({
        'any.required': 'country is required',
        'string.base': 'country must be a string',
      }),
    city: Joi.string().trim().required()
      .messages({
        'any.required': 'city is required',
        'string.base': 'city must be a string',
      }),
    state: Joi.string().trim().required()
      .messages({
        'any.required': 'state is required',
        'string.base': 'state must be a string',
      }),
    pinCode: Joi.string().trim().required()
      .messages({
        'any.required': 'pinCode is required',
        'string.base': 'pinCode must be a string',
      }),
    latitude: Joi.number().required()
      .messages({
        'any.required': 'latitude is required',
        'number.base': 'latitude must be a number',
      }),
    longitude: Joi.number().required()
      .messages({
        'any.required': 'longitude is required',
        'number.base': 'longitude must be a number',
      }),
  })
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