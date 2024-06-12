import Joi from "@hapi/joi";
export const UserRegisterValidation = Joi.object({
  username: Joi.string().required(),
  cnic: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  city: Joi.string().required(),
});
export const UserLoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
