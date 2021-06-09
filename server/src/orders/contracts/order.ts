import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

import { OrderPosition } from "./order-position";

export type OrderDocument = Order & Document;

@Schema()
export class Order {
    @Prop()
    id: string;

    @Prop()
    name1: string;

    @Prop()
    name2: string;

    @Prop()
    comment: string;

    @Prop()
    datetime: string;

    @Prop()
    preOrderId: string;

    @Prop()
    positions: OrderPosition[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);