import { Controller, Get, Post, Body, Delete, Put, Param, Query, UsePipes } from "@nestjs/common";

import { PreOrder } from "./contracts/pre-order";
import { PreOrdersService } from "./pre-orders.service";
import { JoiValidationPipe } from "../validation/joi-validation.pipe";
import { preOrderValidationSchema } from "./contracts/pre-order-validation.schema";

import * as _ from "lodash";

@Controller("preorders")
export class PreOrdersController {
    constructor(private preOrdersService: PreOrdersService) { }

    @Get()
    async get(@Query("name") name: string, @Query("order") order: boolean): Promise<PreOrder[]> {
        if (order) {
            console.log(`Get PreOrder without order by name: ${name || ""}`);
            return this.preOrdersService.getWithoutOrderByName(name || "");
        } else {
            if (_.isNil(name)) {
                console.log(`Get all PreOrders`);
                return this.preOrdersService.getAll();
            } else {
                console.log(`Get PreOrderByName: ${name}`);
                return this.preOrdersService.getByName(name);
            }    
        }
    }

    @Get(":id")
    async getById(@Param("id") id: string): Promise<PreOrder> {
        console.log(`Get PreOrderById: ${id}`);
        return this.preOrdersService.getById(id);
    }

    @Post()
    @UsePipes(new JoiValidationPipe(preOrderValidationSchema))
    async create(@Body() preOrder: PreOrder): Promise<PreOrder> {
        console.log(`Create PreOrder`);
        return this.preOrdersService.create(preOrder);
    }

    @Put(":id")
    async update(@Param("id") id: string, 
            @Body(new JoiValidationPipe(preOrderValidationSchema)) preOrder: PreOrder) {
        console.log(`Update PreOrder: ${preOrder.id}`);
        return this.preOrdersService.update(id, preOrder);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        console.log(`Delete PreOrder: ${id}`);
        return this.preOrdersService.delete(id);
    }
}
