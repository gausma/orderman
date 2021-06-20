import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Communication, CommunicationDocument, CommunicationType } from "./contracts/Communication";

import { v4 as uuidV4 } from "uuid";
import * as _ from "lodash";

@Injectable()
export class CommunicationsService {
    constructor(@InjectModel(Communication.name) private communicationModel: Model<CommunicationDocument>) {}

    toCommunication(communicationDocument: CommunicationDocument): Communication {
        return { 
            id: communicationDocument.id,
            name: communicationDocument.name,
            communicationType: communicationDocument.communicationType,
        };
    }

    async getAll(): Promise<Communication[]> {
        const communicationDocuments = await this.communicationModel.find().exec();
        return communicationDocuments.map((cd: CommunicationDocument) => this.toCommunication(cd));
    }

    async create(communication: Communication): Promise<Communication> {
        const clonedCommunication = _.clone(communication);
        if (_.isNil(clonedCommunication.id)) {
            clonedCommunication.id = uuidV4();
        }
        const newCommunication = new this.communicationModel(clonedCommunication);
        const communicationDocument = await newCommunication.save();
        return this.toCommunication(communicationDocument);
    }

    async update(id: string, communication: Communication): Promise<Communication> {
        const communicationDocument = await this.communicationModel.updateOne({id: id}, communication).exec();
        return this.toCommunication(communicationDocument);
    }

    async delete(id: string): Promise<void> {
        await this.communicationModel.deleteOne({ id: id });
    }

    async deleteAll(): Promise<void> {
        await this.communicationModel.deleteMany(() => true);
    }
}
