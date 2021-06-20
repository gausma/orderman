import { Controller, Get, Post, Body, Header } from "@nestjs/common";
import { BackupsService } from "./backups.service";
import { Backup } from "./contracts/Backup";

@Controller("backups")
export class BackupsController {
    constructor(private backupsService: BackupsService) {}

    // Todo: Content Type
    @Get()
    async createBackup(): Promise<Backup> {
        console.log(`Create backup`);
        return this.backupsService.createBackup();
    }    

    @Get("csv")
    async createCsv(): Promise<any> {
        console.log(`Create csv`);
        return this.backupsService.createCsv();
    }    

    @Post()
    async restoreBackup(@Body() backup: Backup) {
        console.log(`Restore backup`);
        this.backupsService.restoreBackup(backup);
    }  
}
