import Joi from "joi";

export const addressInputSchema = Joi.object({
  cep: Joi.string().length(9).required(),
  neighborhood: Joi.string().required(),
  street: Joi.string().required(),
  number: Joi.string().required(),
  complement: Joi.string().allow(""),
  city: Joi.string().required(),
  state: Joi.string().required(),
  nickname: Joi.string().required(),
});
