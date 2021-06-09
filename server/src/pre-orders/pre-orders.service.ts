
import { Injectable } from '@nestjs/common';
import { PreOrder, PreOrderDocument } from './contracts/pre-order';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import * as _ from 'lodash';

@Injectable()
export class PreOrdersService {
    constructor(@InjectModel(PreOrder.name) private preOrderModel: Model<PreOrderDocument>) {
        preOrderModel.deleteMany(() => true);
        const preOrders: PreOrder[] = [
            {
                id: "1",
                name1: "Gaus",
                name2: "Martin",
                comment: "",
                datetime: "",
                communicationId: "2",
                communicationValue: "",
                positions: [
                    { id: "1", amount: 1 },
                    { id: "2", amount: 0 },
                    { id: "3", amount: 0 },
                    { id: "4", amount: 0 },
                    { id: "5", amount: 0 },
                    { id: "6", amount: 2 },
                    { id: "7", amount: 0 },
                    { id: "8", amount: 1 },
                    { id: "9", amount: 0 },
                    { id: "10", amount: 0 },
                    { id: "11", amount: 1 },
                    { id: "12", amount: 0 },
                ]
            },
            {
                id: "2",
                name1: "Dow",
                name2: "Max",
                comment: "fikiv",
                datetime: "",
                communicationId: "1",
                communicationValue: "123",
                positions: [
                    { id: "1", amount: 2 },
                    { id: "2", amount: 3 },
                    { id: "3", amount: 4 },
                    { id: "4", amount: 5 },
                    { id: "5", amount: 0 },
                    { id: "6", amount: 2 },
                    { id: "7", amount: 0 },
                    { id: "8", amount: 1 },
                    { id: "9", amount: 0 },
                    { id: "10", amount: 0 },
                    { id: "11", amount: 1 },
                    { id: "12", amount: 0 },
                ]
            }
        ];
        preOrders.forEach(preOrder => this.create(preOrder));
    }

    async getAll(): Promise<PreOrder[]> {
        return this.preOrderModel.find().exec();
    }

    async getById(id: string): Promise<PreOrder> {
        return this.preOrderModel.findOne({ id: id }).exec();
    }

    async getByName(name: string): Promise<PreOrder[]> {
        return this.preOrderModel.find({name1: {$regex: name, '$options': 'i'}}).exec();
    }

    async getWithoutOrderByName(name: string): Promise<PreOrder[]> {
        return this.preOrderModel.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "id",
                    foreignField: "preOrderId",
                    as: "preOrderId"
                }
            },
            {
                $addFields: {
                    "preOrderIdSize": { "$size": "$preOrderId" }
                }
            },
            {
                $match: {
                    $and: [
                        { "preOrderIdSize": { $eq: 0 } },
                        {
                            $or: [
                                { name1: {$regex: name, '$options': 'i'} },
                                { name2: {$regex: name, '$options': 'i'} },
                            ]
                        }
                    ]
                }
            },
            {
                $unset: [
                    "preOrderId", "preOrderIdSize"
                ]
            }
        ]).exec();
    }

    async create(preOrder: PreOrder): Promise<PreOrder> {
        const clonedPreOrder = _.clone(preOrder);
        if (_.isNil(clonedPreOrder.id)) {
            clonedPreOrder.id = uuidV4();
        }
        const preOrderDocument = new this.preOrderModel(clonedPreOrder);
        return preOrderDocument.save();
    }

    async update(id: string, preOrder: PreOrder): Promise<PreOrder> {
        return this.preOrderModel.updateOne({ id: id }, preOrder).exec();
    }

    async delete(id: string): Promise<void> {
        await this.preOrderModel.deleteOne({ id: id });
    }
}
