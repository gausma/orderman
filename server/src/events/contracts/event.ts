import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type EventDocument = Event & Document;

export enum EventType {
    None = "none",
    Event = "event",
    SubEvent = "subEvent",
}

@Schema()
export class Event
 {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop()
    eventType: EventType;
}

export const EventSchema = SchemaFactory.createForClass(Event);
