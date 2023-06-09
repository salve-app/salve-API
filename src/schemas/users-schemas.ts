import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const profileSchema = Joi.object({
  fullName: Joi.string().required(),
  cpf: Joi.string().required(),
  gender: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  birthday: Joi.date().required(),
});
