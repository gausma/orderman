import { Module } from '@nestjs/common';
import { PreOrdersService } from './pre-orders.service';
import { PreOrdersController } from './pre-orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PreOrder, PreOrderSchema } from './contracts/pre-order';

@Module({
    imports: [MongooseModule.forFeature([{ name: PreOrder.name, schema: PreOrderSchema }])],    
    providers: [PreOrdersService],
    controllers: [PreOrdersController]
})
export class PreOrdersModule {}
