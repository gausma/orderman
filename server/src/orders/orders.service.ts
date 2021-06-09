
import { Injectable } from '@nestjs/common';
import { Order, OrderDocument } from './contracts/order';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import * as _ from 'lodash';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

    async getAll(): Promise<Order[]> {
        return this.orderModel.find().exec();
    }

    async getById(id: string): Promise<Order> {
        return this.orderModel.findOne({ id: id }).exec();
    }

    async create(order: Order): Promise<Order> {
        const clonedOrder = _.clone(order);
        if (_.isNil(clonedOrder.id)) {
            clonedOrder.id = uuidV4();
        }
        const orderDocument = new this.orderModel(clonedOrder);
        return orderDocument.save();
    }

    async update(id: string, order: Order): Promise<Order> {
        return this.orderModel.updateOne({ id: id }, order).exec();
    }

    async delete(id: string): Promise<void> {
        await this.orderModel.deleteOne({ id: id });
    }   
}
