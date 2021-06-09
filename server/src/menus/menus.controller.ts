import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MenusService } from './menus.service';
import { Menu } from './contracts/Menu';
import { Communication } from 'src/communications/contracts/Communication';

@Controller('menus')
export class MenusController {
    constructor(private menusService: MenusService) {}

    @Get()
    async getAll(): Promise<Menu[]> {
      return this.menusService.getAll();
    }    

    @Post()
    async create(@Body() menu: Menu) {
      this.menusService.create(menu);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() menu: Menu) {
        return this.menusService.update(id, menu);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.menusService.delete(id);
    }    
}
