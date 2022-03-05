import { Module } from "@nestjs/common";

import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Event, EventSchema } from "./contracts/Event";

@Module({
    imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule { }
