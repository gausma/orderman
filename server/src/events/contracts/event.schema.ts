import * as Joi from "joi";
import { EventType } from "./Event";
import { getEnumValues } from "../../validation/enum-helper";

export const eventValidationSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.string().guid({ version: ["uuidv1", "uuidv4"]}).optional(),
    name: Joi.string().required(),
    eventType: Joi.string().valid(...getEnumValues(EventType)).required(),
})