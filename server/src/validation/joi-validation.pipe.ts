import * as Joi from "joi";
import { BadRequestException, Logger, NotImplementedException, Optional, PipeTransform } from "@nestjs/common";

/**
 * Schema validation pipe using Joi.
 */
export class JoiValidationPipe implements PipeTransform {
    private schemas: Joi.AnySchema[];
    private readonly logger: Logger = new Logger();

    /**
     * Joi-Validation Pipe Constructor
     * @param schemas Schema(s) to validate
     * @param wrapSchemaAsArray Wrap as array
     */
    public constructor(schemas?: Joi.AnySchema | Joi.AnySchema[], @Optional() private wrapSchemaAsArray?: boolean) {
        if (!schemas) {
            throw new NotImplementedException("Missing validation schema");
        }
        this.schemas = Array.isArray(schemas) ? schemas : [schemas];
    }

    /**
     * Validation entry function
     * Throws on error
     * @param value Value to validate
     * @returns Value on success
     */
    public transform(value: unknown): unknown {
        this.validateAsSchema(value);
        return value;
    }

    /**
     * Validation
     * Throws on error
     * @param value Value to validate
     */
    public validateAsSchema(value: unknown): void {
        const { error: error } =
            Array.isArray(value) && this.wrapSchemaAsArray
                ? Joi.array().items(this.mergeSchemas()).validate(value)
                : this.mergeSchemas().validate(value);
        if (error) {
            this.logger.warn(error.message, "JoiValidationPipe");
            throw new BadRequestException(`Validation failed. Error Message: "${error.message}"`);
        }
    }

    /**
     * Schema merger
     * @returns  Merged schema
     */
    public mergeSchemas(): Joi.AnySchema {
        return this.schemas.reduce(
            (merged: Joi.AnySchema, schema: Joi.AnySchema) => (merged ? merged.concat(schema) : schema),
            undefined,
        ) as Joi.Schema;
    }
}
