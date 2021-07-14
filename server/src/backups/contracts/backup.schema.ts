import * as Joi from "joi";
import { communicationValidationSchema } from "../../communications/contracts/communication.schema";
import { menuValidationSchema } from "../../menus/contracts/menu.schema";
import { orderValidationSchema } from "../../orders/contracts/order-validation.schema";
import { preOrderValidationSchema } from "../../pre-orders/contracts/pre-order-validation.schema";

export const backupValidationSchema: Joi.ObjectSchema = Joi.object({
    communications: Joi.array().items(communicationValidationSchema).required(),
    menus: Joi.array().items(menuValidationSchema).required(),
    orders: Joi.array().items(orderValidationSchema).required(),
    preOrders: Joi.array().items(preOrderValidationSchema).required(),
})