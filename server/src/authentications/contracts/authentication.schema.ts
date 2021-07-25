import * as Joi from "joi";

export const authenticationValidationSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.string().guid({ version: ["uuidv1", "uuidv4"]}).optional(),
    user: Joi.string().required().allow(""),
    password: Joi.string().required().allow(""),
    credentials: Joi.object().keys({
        preOrders: Joi.object().keys({
            read: Joi.bool().required(),
            write: Joi.bool().required(),
            order: Joi.bool().required(),
        }),
        orders: Joi.object().keys({
            read: Joi.bool().required(),
            write: Joi.bool().required(),
        }),
        communications: Joi.object().keys({
            read: Joi.bool().required(),
            write: Joi.bool().required(),
        }),
        menus: Joi.object().keys({
            read: Joi.bool().required(),
            write: Joi.bool().required(),
        }),
        statistics: Joi.object().keys({
            read: Joi.bool().required(),
        }),
        backups: Joi.object().keys({
            read: Joi.bool().required(),
        }),
        infos: Joi.object().keys({
            read: Joi.bool().required(),
        }),
        authentications: Joi.object().keys({
            read: Joi.bool().required(),
            write: Joi.bool().required(),
        }),
    })
})
