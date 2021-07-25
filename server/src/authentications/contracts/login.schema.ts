import * as Joi from "joi";

export const loginValidationSchema: Joi.ObjectSchema = Joi.object({
    user: Joi.string().required().allow(""),
    password: Joi.string().required().allow(""),
})
