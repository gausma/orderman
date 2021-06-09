import { Injectable } from '@nestjs/common';
import { Menu, MenuDocument } from './contracts/Menu';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import * as _ from 'lodash';

@Injectable()
export class MenusService {
    constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {
        menuModel.deleteMany(() => true);
        const menus: Menu[] = [
            {id: "1", name: "Schlachtplatte", price: 9.0, comment: ""},
            {id: "2", name: "Schlachtplatte 2x LW", price: 9.0, comment: ""},
            {id: "3", name: "Kesselfleisch", price: 8.0, comment: ""},
            {id: "4", name: "Blut-/Leberwurst", price: 7.0, comment: ""},
            {id: "5", name: "2x Leberwurst", price: 7.0, comment: ""},
            {id: "6", name: "2x Blutwurst", price: 7.0, comment: ""},
            {id: "7", name: "Sauerkraut", price: 3.0, comment: ""},
            {id: "8", name: "Maultaschen", price: 6.0, comment: ""},
            {id: "9", name: "Flammkuchen", price: 6.0, comment: ""},
            {id: "10", name: "Pizza Margherita", price: 6.0, comment: ""},
            {id: "11", name: "Pizza Salami", price: 6.0, comment: ""},
            {id: "12", name: "Tellersülze", price: 6.5, comment: ""}
        ];  
        menus.forEach(menu => this.create(menu));
    }

    async getAll(): Promise<Menu[]> {
        return this.menuModel.find().exec();
    }

    async create(menu: Menu): Promise<Menu> {
        const clonedMenu = _.clone(menu);
        if (_.isNil(clonedMenu.id)) {
            clonedMenu.id = uuidV4();
        }
        const newMenu = new this.menuModel(clonedMenu);
        return newMenu.save();
    }

    async update(id: string, menu: Menu): Promise<Menu> {
        return this.menuModel.updateOne({id: id}, menu).exec();
    }

    async delete(id: string): Promise<void> {
        await this.menuModel.deleteOne({ id: id });
    }
}
