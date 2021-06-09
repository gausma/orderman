import { Controller, Get, Post, Body, Delete, Put, Param, Query } from '@nestjs/common';
import { PreOrder } from './contracts/pre-order';
import { PreOrdersService } from './pre-orders.service';
import * as _ from 'lodash';

@Controller('preorders')
export class PreOrdersController {
    constructor(private preOrdersService: PreOrdersService) { }

    @Get()
    async get(@Query('name') name: string, @Query('order') order: boolean): Promise<PreOrder[]> {
        if (order) {
            console.log(`Get PreOrder without order by name: ${name || ""}`);
            return this.preOrdersService.getWithoutOrderByName(name || "");
        } else {
            if (_.isNil(name)) {
                console.log(`Get PreOrders`);
                return this.preOrdersService.getAll();
            } else {
                console.log(`Get PreOrderByName: ${name}`);
                return this.preOrdersService.getByName(name);
            }    
        }
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<PreOrder> {
        console.log(`Get PreOrderById: ${id}`);
        return this.preOrdersService.getById(id);
    }

    @Post()
    async create(@Body() preOrder: PreOrder): Promise<PreOrder> {
        console.log(`Update PreOrder: ${preOrder}`);
        return this.preOrdersService.create(preOrder);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() preOrder: PreOrder) {
        console.log(`Update PreOrder: ${preOrder}`);
        return this.preOrdersService.update(id, preOrder);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        console.log(`Delete PreOrder: ${id}`);
        return this.preOrdersService.delete(id);
    }
}
