import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { Order, OrderSchema } from "./contracts/order";

@Module({
    imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],    
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}
