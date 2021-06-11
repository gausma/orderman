
import { Injectable } from '@nestjs/common';
import { PreOrder, PreOrderDocument } from './contracts/pre-order';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import * as _ from 'lodash';

@Injectable()
export class PreOrdersService {
    constructor(@InjectModel(PreOrder.name) private preOrderModel: Model<PreOrderDocument>) {}


    toPreOrder(preOrderDocument: PreOrderDocument): PreOrder {
        return { 
            id: preOrderDocument.id,
            name1: preOrderDocument.name1,
            name2: preOrderDocument.name2,
            comment: preOrderDocument.comment,
            communicationId: preOrderDocument.communicationId,
            communicationValue: preOrderDocument.communicationValue,
            datetime: preOrderDocument.datetime,
            positions: preOrderDocument.positions,
        };
    }

    async getAll(): Promise<PreOrder[]> {
        const preOrderDocuments = await this.preOrderModel.find().exec();
        return preOrderDocuments.map((pod: PreOrderDocument) => this.toPreOrder(pod));
    }

    async getById(id: string): Promise<PreOrder> {
        const preOrderDocument = await this.preOrderModel.findOne({ id: id }).exec();
        return this.toPreOrder(preOrderDocument);
    }

    async getByName(name: string): Promise<PreOrder[]> {
        const preOrderDocuments = await this.preOrderModel.find({name1: {$regex: name, '$options': 'i'}}).exec();
        return preOrderDocuments.map((pod: PreOrderDocument) => this.toPreOrder(pod));
    }

    async getWithoutOrderByName(name: string): Promise<PreOrder[]> {
        const preOrderDocuments = await this.preOrderModel.aggregate([
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
            }
        ]).exec();
        return preOrderDocuments.map((pod: PreOrderDocument) => this.toPreOrder(pod));
    }

    async create(preOrder: PreOrder): Promise<PreOrder> {
        const clonedPreOrder = _.clone(preOrder);
        if (_.isNil(clonedPreOrder.id)) {
            clonedPreOrder.id = uuidV4();
        }
        const newPreOrder = new this.preOrderModel(clonedPreOrder);
        const preOrderDocument = await newPreOrder.save();
        return this.toPreOrder(preOrderDocument);
    }

    async update(id: string, preOrder: PreOrder): Promise<PreOrder> {
        const preOrderDocument = await this.preOrderModel.updateOne({ id: id }, preOrder).exec();
        return this.toPreOrder(preOrderDocument);
    }

    async delete(id: string): Promise<void> {
        await this.preOrderModel.deleteOne({ id: id });
    }

    async deleteAll(): Promise<void> {
        await this.preOrderModel.deleteMany(() => true);
    }    
}
