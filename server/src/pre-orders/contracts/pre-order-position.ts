import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PreOrderPositionDocument = PreOrderPosition & Document;


@Schema()
export class PreOrderPosition {
    @Prop()
    id: string;

    @Prop()
    amount: number;
}

export const PreOrderPositionSchema = SchemaFactory.createForClass(PreOrderPosition);
