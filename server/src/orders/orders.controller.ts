import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { Order } from './contracts/order';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Get()
    async getAll(): Promise<Order[]> {
        console.log(`Get all Orders`);
        return this.ordersService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<Order> {
        console.log(`Get OrderById: ${id}`);
        return this.ordersService.getById(id);
    }    

    @Post()
    async create(@Body() order: Order): Promise<Order> {
        console.log(`Create Order: ${order.id}`);
        return this.ordersService.create(order);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() order: Order) {
        console.log(`Update Order: ${order.id}`);
        return this.ordersService.update(id, order);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        console.log(`Delete Order: ${id}`);
        return this.ordersService.delete(id);
    }    
}
