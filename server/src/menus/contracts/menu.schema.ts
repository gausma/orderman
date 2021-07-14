import * as Joi from "joi";

export const menuValidationSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.string().guid({ version: ["uuidv1", "uuidv4"]}).optional(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    comment: Joi.string().required().allow(""),
    sequence: Joi.number().required(),
    stock: Joi.number().required(),
})