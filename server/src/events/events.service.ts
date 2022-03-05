import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Event, EventDocument, EventType } from "./contracts/Event";

import { v4 as uuidV4 } from "uuid";
import * as _ from "lodash";

@Injectable()
export class EventsService {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

    toEvent(eventDocument: EventDocument): Event {
        return { 
            id: eventDocument.id,
            name: eventDocument.name,
            eventType: eventDocument.eventType,
        };
    }

    async getAll(): Promise<Event[]> {
        const eventDocuments = await this.eventModel.find().exec();
        return eventDocuments.map((cd: EventDocument) => this.toEvent(cd));
    }

    async create(event: Event): Promise<Event> {
        const clonedEvent = _.clone(event);
        if (_.isNil(clonedEvent.id)) {
            clonedEvent.id = uuidV4();
        }
        const newEvent = new this.eventModel(clonedEvent);
        const eventDocument = await newEvent.save();
        return this.toEvent(eventDocument);
    }

    async update(id: string, event: Event): Promise<Event> {
        const eventDocument = await this.eventModel.updateOne({id: id}, event).exec();
        return this.toEvent(eventDocument);
    }

    async delete(id: string): Promise<void> {
        await this.eventModel.deleteOne({ id: id });
    }

    async deleteAll(): Promise<void> {
        await this.eventModel.deleteMany(() => true);
    }
}
