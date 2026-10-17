const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required().messages({
    "string.base": "Full name must be text.",
    "string.empty": "Full name is required.",
    "string.min": "Full name must be at least 3 characters long.",
    "string.max": "Full name cannot exceed 30 characters.",
    "any.required": "Full name is required.",
  }),

  email: Joi.string().trim().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email address is required.",
    "any.required": "Email address is required.",
  }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_\-+~=]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain uppercase and lowercase letters, a number, and a special character (@$!%*?&#^_-+~=).",
      "string.min": "Password must be at least 8 characters long.",
      "string.empty": "Password is required.",
      "any.required": "Password is required.",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),

  password: Joi.string().required(),
});

module.exports = {
  signupSchema,
  loginSchema,
};