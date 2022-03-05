import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes } from "@nestjs/common";

import { EventsService } from "./events.service";
import { Event } from "./contracts/Event";
import { JoiValidationPipe } from "../validation/joi-validation.pipe";
import { eventValidationSchema } from "./contracts/event.schema";

@Controller("events")
export class EventsController {
    constructor(private eventsService: EventsService) { }

    @Get()
    async getAll(): Promise<Event[]> {
        console.log(`Get all Events`);
        return this.eventsService.getAll();
    }

    @Post()
    @UsePipes(new JoiValidationPipe(eventValidationSchema))
    async create(@Body() event: Event) {
        console.log(`Create Event`);
        this.eventsService.create(event);
    }

    @Put(":id")
    async update(@Param("id") id: string, 
            @Body(new JoiValidationPipe(eventValidationSchema)) event: Event) {
        console.log(`Update Event: ${event.id}`);
        return this.eventsService.update(id, event);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        console.log(`Delete Event: ${id}`);
        return this.eventsService.delete(id);
    }
}
