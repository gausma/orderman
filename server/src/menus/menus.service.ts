import { Injectable } from '@nestjs/common';
import { Menu, MenuDocument } from './contracts/Menu';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import * as _ from 'lodash';

@Injectable()
export class MenusService {
    constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

    toMenu(menuDocument: MenuDocument): Menu {
        return { 
            id: menuDocument.id,
            name: menuDocument.name,
            price: menuDocument.price,
            comment: menuDocument.comment,
        };
    }

    async getAll(): Promise<Menu[]> {
        const menuDocuments = await this.menuModel.find().exec();
        return menuDocuments.map((md: MenuDocument) => this.toMenu(md));
    }

    async create(menu: Menu): Promise<Menu> {
        const clonedMenu = _.clone(menu);
        if (_.isNil(clonedMenu.id)) {
            clonedMenu.id = uuidV4();
        }
        const newMenu = new this.menuModel(clonedMenu);
        const menuDocument = await newMenu.save();
        return this.toMenu(menuDocument);
    }

    async update(id: string, menu: Menu): Promise<Menu> {
        const menuDocument = await this.menuModel.updateOne({id: id}, menu).exec();
        return this.toMenu(menuDocument);
    }

    async delete(id: string): Promise<void> {
        await this.menuModel.deleteOne({ id: id });
    }

    async deleteAll(): Promise<void> {
        await this.menuModel.deleteMany(() => true);
    }
}
