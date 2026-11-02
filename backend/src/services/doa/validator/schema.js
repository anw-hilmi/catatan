import Joi from "joi";

export const doaSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  title: Joi.string().required(),
});
