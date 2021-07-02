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

    @Get("preorders")
    async createPreOrdersCsv(): Promise<any> {
        console.log(`Create preorders csv`);
        return this.backupsService.createPreOrdersCsv();
    }    

    @Get("contacts")
    async createContactsCsv(): Promise<any> {
        console.log(`Create contacts csv`);
        return this.backupsService.createContactsCsv();
    }    

    @Post()
    async restoreBackup(@Body() backup: Backup) {
        console.log(`Restore backup`);
        this.backupsService.restoreBackup(backup);
    }  
}
