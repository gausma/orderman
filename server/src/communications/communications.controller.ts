import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { Communication } from './contracts/Communication';

@Controller('communications')
export class CommunicationsController {
    constructor(private communicationsService: CommunicationsService) {}

    @Get()
    async getAll(): Promise<Communication[]> {
      return this.communicationsService.getAll();
    }    

    @Post()
    async create(@Body() communication: Communication) {
      this.communicationsService.create(communication);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() communication: Communication) {
        return this.communicationsService.update(id, communication);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
console.log(id);
        return this.communicationsService.delete(id);
    }    
}
