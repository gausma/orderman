import { Module } from '@nestjs/common';
import { BackupsController } from './backups.controller';
import { BackupsService } from './backups.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Communication, CommunicationSchema } from '../communications/contracts/Communication';
import { Menu, MenuSchema } from '../menus/contracts/menu';
import { Order, OrderSchema } from '../orders/contracts/Order';
import { PreOrder, PreOrderSchema } from '../pre-orders/contracts/pre-order';
import { CommunicationsModule } from 'src/communications/communications.module';
import { MenusModule } from 'src/menus/menus.module';
import { OrdersModule } from 'src/orders/orders.module';
import { PreOrdersModule } from 'src/pre-orders/pre-orders.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Communication.name, schema: CommunicationSchema }]),
        MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
        MongooseModule.forFeature([{ name: PreOrder.name, schema: PreOrderSchema }]),
        CommunicationsModule,
        MenusModule,
        OrdersModule,
        PreOrdersModule,
    ],        
    controllers: [BackupsController],
    providers: [BackupsService],
})
export class BackupsModule {}
