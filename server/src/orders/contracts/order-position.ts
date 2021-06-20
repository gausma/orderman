import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type OrderPositionDocument = OrderPosition & Document;


@Schema()
export class OrderPosition {
    @Prop()
    id: string;

    @Prop()
    amount: number;
}

export const OrderPositionSchema = SchemaFactory.createForClass(OrderPosition);
