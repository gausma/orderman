
import { Injectable } from '@nestjs/common';
import { Order, OrderDocument } from './contracts/order';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import * as _ from 'lodash';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

    toOrder(orderDocument: OrderDocument): Order {
        return { 
            id: orderDocument.id,
            name1: orderDocument.name1,
            name2: orderDocument.name2,
            comment: orderDocument.comment,
            datetime: orderDocument.datetime,
            preOrderId: orderDocument.preOrderId,
            positions: orderDocument.positions,
        };
    }

    async getAll(): Promise<Order[]> {
        const orderDocuments = await this.orderModel.find().exec();
        return orderDocuments.map((od: OrderDocument) => this.toOrder(od));
    }

    async getById(id: string): Promise<Order> {
        const orderDocument = await this.orderModel.findOne({ id: id }).exec();
        return this.toOrder(orderDocument);
    }

    async create(order: Order): Promise<Order> {
        const clonedOrder = _.clone(order);
        if (_.isNil(clonedOrder.id)) {
            clonedOrder.id = uuidV4();
        }
        const newOrder = new this.orderModel(clonedOrder);
        const orderDocument = await newOrder.save();
        return this.toOrder(orderDocument);
    }

    async update(id: string, order: Order): Promise<Order> {
        const orderDocument = await this.orderModel.updateOne({ id: id }, order).exec();
        return this.toOrder(orderDocument);
    }

    async delete(id: string): Promise<void> {
        await this.orderModel.deleteOne({ id: id });
    }   

    async deleteAll(): Promise<void> {
        await this.orderModel.deleteMany(() => true);
    }    
}
