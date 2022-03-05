export enum EventType {
    None = "none",
    Event = "event",
    SubEvent = "subEvent",
}

export class Event {
    id?: string;
    name: string;
    eventType: EventType;
}
