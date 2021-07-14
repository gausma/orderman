import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes } from "@nestjs/common";

import { MenusService } from "./menus.service";
import { Menu } from "./contracts/Menu";
import { JoiValidationPipe } from "../validation/joi-validation.pipe";
import { menuValidationSchema } from "./contracts/menu.schema";

@Controller("menus")
export class MenusController {
    constructor(private menusService: MenusService) { }

    @Get()
    async getAll(): Promise<Menu[]> {
        console.log(`Get all Menus`);
        return this.menusService.getAll();
    }

    @Post()
    @UsePipes(new JoiValidationPipe(menuValidationSchema))
    async create(@Body() menu: Menu): Promise<Menu> {
        console.log(`Create Menu`);
        return this.menusService.create(menu);
    }

    @Put(":id")
    async update(@Param("id") id: string, 
            @Body(new JoiValidationPipe(menuValidationSchema)) menu: Menu): Promise<Menu> {
        console.log(`Update Menu: ${menu.id}`);
        return this.menusService.update(id, menu);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        console.log(`Delete Menu: ${id}`);
        return this.menusService.delete(id);
    }
}
