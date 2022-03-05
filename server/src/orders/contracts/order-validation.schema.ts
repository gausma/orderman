import * as Joi from "joi";

export const orderValidationSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.string().guid({ version: ["uuidv1", "uuidv4"] }).optional(),
    name1: Joi.string().required(),
    name2: Joi.string().required().allow(""),
    comment: Joi.string().required().allow(""),
    datetime: Joi.string().required(),
    eventId: Joi.string().guid({ version: ["uuidv1", "uuidv4"] }).required(),    
    preOrderId: Joi.string().guid({ version: ["uuidv1", "uuidv4"] }).required().allow(""),
    positions: Joi.array()
        .items(
            Joi.object().keys({
                id: Joi.string().guid({ version: ["uuidv1", "uuidv4"] }).required(),
                amount: Joi.number().required(),
            })
        ).required(),
})