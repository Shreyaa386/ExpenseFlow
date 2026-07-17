const Joi = require("joi");

const transactionSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  amount: Joi.number()
    .positive()
    .required(),

  type: Joi.string()
    .valid("income", "expense")
    .required(),

  category: Joi.string()
    .trim()
    .required(),

  date: Joi.date()
    .optional(),

  note: Joi.string()
    .trim()
    .allow("")
    .optional(),

  account: Joi.string()
    .trim()
    .optional(),
});

module.exports = {
  transactionSchema,
};