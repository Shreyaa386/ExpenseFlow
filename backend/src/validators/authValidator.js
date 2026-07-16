const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required(),

  email: Joi.string().trim().email().required(),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),

  password: Joi.string().required(),
});

module.exports = {
  signupSchema,
  loginSchema,
};