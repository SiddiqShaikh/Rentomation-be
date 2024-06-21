import Joi from "@hapi/joi";

export const propertyCreationValidation = Joi.object({
  name: Joi.string().required(),
  city: Joi.string().required(),
  address: Joi.string().required(),
  room: Joi.number().required(),
  rent: Joi.string().required(),
});
