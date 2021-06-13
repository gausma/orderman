import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuDocument = Menu & Document;

@Schema()
export class Menu {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop()
    price: number;

    @Prop()
    comment: string;

    @Prop()
    sequence: number;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
