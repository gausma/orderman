import { Controller, Get, Post, Body } from '@nestjs/common';
import { BackupsService } from './backups.service';
import { Backup } from './contracts/Backup';

@Controller('backups')
export class BackupsController {
    constructor(private backupsService: BackupsService) {}

    @Get()
    async create(): Promise<Backup> {
        console.log(`Create backup`);
        return this.backupsService.get();
    }    

    @Post()
    async restore(@Body() backup: Backup) {
        console.log(`Restore backup`);
        this.backupsService.create(backup);
    }  
}
