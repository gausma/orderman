import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes } from "@nestjs/common";

import { CommunicationsService } from "./communications.service";
import { Communication } from "./contracts/Communication";
import { JoiValidationPipe } from "../validation/joi-validation.pipe";
import { communicationValidationSchema } from "./contracts/communication.schema";

@Controller("communications")
export class CommunicationsController {
    constructor(private communicationsService: CommunicationsService) { }

    @Get()
    async getAll(): Promise<Communication[]> {
        console.log(`Get all Communications`);
        return this.communicationsService.getAll();
    }

    @Post()
    @UsePipes(new JoiValidationPipe(communicationValidationSchema))
    async create(@Body() communication: Communication) {
        console.log(`Create Communication`);
        this.communicationsService.create(communication);
    }

    @Put(":id")
    async update(@Param("id") id: string, 
            @Body(new JoiValidationPipe(communicationValidationSchema)) communication: Communication) {
        console.log(`Update Communication: ${communication.id}`);
        return this.communicationsService.update(id, communication);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        console.log(`Delete Communication: ${id}`);
        return this.communicationsService.delete(id);
    }
}
