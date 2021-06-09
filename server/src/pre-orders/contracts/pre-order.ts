import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

import { PreOrderPosition } from "./pre-order-position";

export type PreOrderDocument = PreOrder & Document;

@Schema()
export class PreOrder {
    @Prop()
    id: string;

    @Prop()
    datetime: string;

    @Prop()
    name1: string;

    @Prop()
    name2: string;

    @Prop()
    comment: string;

    @Prop()
    communicationId: string;

    @Prop()
    communicationValue: string;

    @Prop()
    positions: PreOrderPosition[];
}

export const PreOrderSchema = SchemaFactory.createForClass(PreOrder);