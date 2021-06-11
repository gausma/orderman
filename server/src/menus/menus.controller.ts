import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MenusService } from './menus.service';
import { Menu } from './contracts/Menu';
import { Communication } from 'src/communications/contracts/Communication';

@Controller('menus')
export class MenusController {
    constructor(private menusService: MenusService) { }

    @Get()
    async getAll(): Promise<Menu[]> {
        console.log(`Get all Menus`);
        return this.menusService.getAll();
    }

    @Post()
    async create(@Body() menu: Menu) {
        console.log(`Create Menu: ${menu.id}`);
        this.menusService.create(menu);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() menu: Menu) {
        console.log(`Update Menu: ${menu.id}`);
        return this.menusService.update(id, menu);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        console.log(`Delete Menu: ${id}`);
        return this.menusService.delete(id);
    }
}
