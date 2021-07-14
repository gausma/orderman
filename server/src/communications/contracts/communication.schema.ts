import * as Joi from "joi";
import { CommunicationType } from "./Communication";
import { getEnumValues } from "../../validation/enum-helper";

export const communicationValidationSchema: Joi.ObjectSchema = Joi.object({
    id: Joi.string().guid({ version: ["uuidv1", "uuidv4"]}).optional(),
    name: Joi.string().required(),
    communicationType: Joi.string().valid(...getEnumValues(CommunicationType)).required(),
})