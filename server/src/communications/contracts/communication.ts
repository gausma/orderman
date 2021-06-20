import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CommunicationDocument = Communication & Document;

export enum CommunicationType {
    None = "none",
    Text = "text",
    Check = "check",
    Email = "email",
    Phone = "phone",
}

@Schema()
export class Communication
 {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop()
    communicationType: CommunicationType;
}

export const CommunicationSchema = SchemaFactory.createForClass(Communication);
