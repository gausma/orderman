import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { BackupsController } from "./backups.controller";
import { BackupsService } from "./backups.service";

import { Event, EventSchema } from "../events/contracts/Event";
import { Communication, CommunicationSchema } from "../communications/contracts/Communication";
import { Menu, MenuSchema } from "../menus/contracts/menu";
import { Order, OrderSchema } from "../orders/contracts/Order";
import { PreOrder, PreOrderSchema } from "../pre-orders/contracts/pre-order";

import { EventsModule } from "../events/events.module";
import { CommunicationsModule } from "../communications/communications.module";
import { MenusModule } from "../menus/menus.module";
import { OrdersModule } from "../orders/orders.module";
import { PreOrdersModule } from "../pre-orders/pre-orders.module";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
        MongooseModule.forFeature([{ name: Communication.name, schema: CommunicationSchema }]),
        MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
        MongooseModule.forFeature([{ name: PreOrder.name, schema: PreOrderSchema }]),
        EventsModule,
        CommunicationsModule,
        MenusModule,
        OrdersModule,
        PreOrdersModule,
    ],        
    controllers: [BackupsController],
    providers: [BackupsService],
})
export class BackupsModule {}
