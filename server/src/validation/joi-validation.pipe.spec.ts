import * as Joi from "joi";

import { JoiValidationPipe } from "./joi-validation.pipe";

/**
 * The export data like parameters, events, columns.
 */
export enum ExportDataType {
    parameter = "parameter",
    arrayParameter = "arrayParameter",
    result = "result",
    measurement = "measurement",
    envelope = "envelope",
    last = "last",
    statisticFunction = "statisticFunction",
    event = "event",
}

describe("joi-validation-pipe", () => {
    const schemaMock1: Joi.ObjectSchema = Joi.object({
        id: Joi.string().required(),
    });

    // const schemaMock2: Joi.ObjectSchema = Joi.object({
    //     id: Joi.string().required(),
    //     unitId: Joi.string().optional(),
    //     type: Joi.string()
    //         .valid(...Object.keys(ExportDataType))
    //         .optional(),
    // });

    describe("constructor", () => {
        it("should be defined", async () => {
            const testobject = new JoiValidationPipe({} as Joi.Schema);
            expect(testobject).toBeDefined();
        });

        it("should throw", () => {
            try {
                const testobject = new JoiValidationPipe();
                expect(testobject).not.toBeDefined();
            } catch (err) {
                expect(err).toBeTruthy();
            }
        });
    });

    describe("mergeSchemas", () => {
        // TODO: fix test. Something wiht object is serialized and should match, but jest wont regocinze it as the same
        // it("should merge schemas", async () => {
        //     const testobject = new JoiValidationPipe([schemaMock1, schemaMock2]);
        //     expect(testobject.mergeSchemas()).toMatchObject(schemaMock1);
        // });
        it("should merge one scheme to the same schema", () => {
            const testobject = new JoiValidationPipe([schemaMock1]);
            expect(testobject.mergeSchemas()).toMatchObject(schemaMock1);
        });
    });

    describe("validateSchema", () => {
        const correctSchemaMock1Object = {
            id: "correctId",
        };
        const incorrectSchemaMock1Object = {
            name: "someName",
        };

        it("should validate a correct input", () => {
            const testobject = new JoiValidationPipe(schemaMock1);
            expect(() => testobject.validateAsSchema(correctSchemaMock1Object)).not.toThrow();
        });

        it("should throw if wrong input", () => {
            const testobject = new JoiValidationPipe(schemaMock1);
            expect(() => testobject.validateAsSchema(incorrectSchemaMock1Object)).toThrowError(
                /Validation failed. Error Message/,
            );
        });
    });

    describe("transform", () => {
        const correctSchemaMock1Object = {
            id: "correctId",
        };
        const incorrectSchemaMock1Object = {
            name: "someName",
        };

        it("should validate a correct input", () => {
            const testobject = new JoiValidationPipe(schemaMock1);
            expect(() => testobject.transform(correctSchemaMock1Object)).not.toThrow();
        });

        it("should throw if wrong input", () => {
            const testobject = new JoiValidationPipe(schemaMock1);
            expect(() => testobject.transform(incorrectSchemaMock1Object)).toThrowError(
                /Validation failed. Error Message/,
            );
        });
    });
});
