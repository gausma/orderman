import { Controller, Get, Post, Body, Param, Delete, Put, UsePipes } from "@nestjs/common";

import { Order } from "./contracts/order";
import { OrdersService } from "./orders.service";
import { JoiValidationPipe } from "../validation/joi-validation.pipe";
import { orderValidationSchema } from "./contracts/order-validation.schema"

@Controller("orders")
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Get()
    async getAll(): Promise<Order[]> {
        console.log(`Get all Orders`);
        return this.ordersService.getAll();
    }

    @Get(":id")
    async getById(@Param("id") id: string): Promise<Order> {
        console.log(`Get OrderById: ${id}`);
        return this.ordersService.getById(id);
    }    

    @Post()
    @UsePipes(new JoiValidationPipe(orderValidationSchema))
    async create(@Body() order: Order): Promise<Order> {
        console.log(`Create Order`);
        return this.ordersService.create(order);
    }

    @Put(":id")
    async update(@Param("id") id: string, 
            @Body(new JoiValidationPipe(orderValidationSchema)) order: Order): Promise<Order> {
        console.log(`Update Order: ${order.id}`);
        return this.ordersService.update(id, order);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        console.log(`Delete Order: ${id}`);
        return this.ordersService.delete(id);
    }    
}
