import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { PreOrdersService } from "./pre-orders.service";
import { PreOrdersController } from "./pre-orders.controller";
import { PreOrder, PreOrderSchema } from "./contracts/pre-order";

@Module({
    imports: [MongooseModule.forFeature([{ name: PreOrder.name, schema: PreOrderSchema }])],
    controllers: [PreOrdersController],
    providers: [PreOrdersService],
    exports: [PreOrdersService],
})
export class PreOrdersModule { }
