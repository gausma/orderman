import { Injectable } from "@nestjs/common";

import { Backup } from "./contracts/backup";
import { CommunicationsService } from "../communications/communications.service";
import { MenusService } from "../menus/menus.service";
import { OrdersService } from "../orders/orders.service";
import { PreOrdersService } from "../pre-orders/pre-orders.service";
import { Menu } from "../menus/contracts/Menu";
import { PreOrderPosition } from "../pre-orders/contracts/pre-order-position";

import * as _ from "lodash";
import { PreOrder } from "src/pre-orders/contracts/pre-order";
import { Communication } from "src/communications/contracts/Communication";

const csvSeparator = ";";
const lineSeparator = "\r\n";

@Injectable()
export class BackupsService {
    constructor(
        private communicationsService: CommunicationsService,
        private menusService: MenusService,
        private ordersService: OrdersService,
        private preOrdersService: PreOrdersService) {
        }

    async createBackup(): Promise<Backup> {
        const backup: Backup = {
            communications: await this.communicationsService.getAll(),
            menus: await this.menusService.getAll(),
            orders: await this.ordersService.getAll(),
            preOrders: await this.preOrdersService.getAll(),
        }
        return backup;
    }

    async restoreBackup(backup: Backup): Promise<void> {
        await this.communicationsService.deleteAll();
        await this.menusService.deleteAll();
        await this.ordersService.deleteAll();
        await this.preOrdersService.deleteAll();

        backup.communications.map(c => this.communicationsService.create(c));
        backup.menus.map(m => this.menusService.create(m));
        backup.orders.map(o => this.ordersService.create(o));
        backup.preOrders.map(po => this.preOrdersService.create(po));

        return null;
    }

    async createPreOrdersCsv(): Promise<string> {
        const menus = await this.menusService.getAll();
        const preOrders = await this.preOrdersService.getAll();

        // Header - line 1
        const sortedMenus = menus.sort((a, b) => a.sequence - b.sequence );

        let csv = "Name1;Name2;Comment";
        sortedMenus.forEach((menu: Menu, index: number) => {
            csv += csvSeparator;
            csv += this.encodeCsv(menu.name);
        });
        csv += ";Count;Total";
        
        csv += lineSeparator;

        // Header - line 2
        csv += ";;";
        sortedMenus.forEach((menu: Menu, index: number) => {
            csv += csvSeparator;
            csv += menu.price;
        });
        csv += ";;";

        csv += lineSeparator;

        // Data
        preOrders.forEach((preOrder) => {
            var count = 0;
            var total = 0;

            csv += this.encodeCsv(preOrder.name1);
            csv += csvSeparator;
            csv += this.encodeCsv(preOrder.name2);
            csv += csvSeparator;            
            csv += this.encodeCsv(preOrder.comment);
            csv += csvSeparator;            

            sortedMenus.forEach((menu: Menu, index: number) => {
                if (index > 0) {
                    csv += csvSeparator;
                }

                const preorder = preOrder.positions.find((position: PreOrderPosition) => position.id === menu.id);
                csv += preorder.amount;

                count += preorder.amount;
                total += preorder.amount * menu.price;
            });

            csv += ";";
            csv += count;
            csv += ";";
            csv += total;

            csv += lineSeparator;
        });

        return csv;
    }

    async createContactsCsv(): Promise<string> {
        const communications = await this.communicationsService.getAll();
        const preOrders = await this.preOrdersService.getAll();
        const sortedPreOrders = preOrders.sort((a, b) => {
            if (a.name1 < b.name1) {
                return -1;
            } else if (a.name1 > b.name1) {
                return 1;
            } else {
                if (a.name2 < b.name2) {
                    return -1;
                } else if (a.name2 > b.name2) {
                    return 1;
                } else {
                    return 0;
                }
            }          
        });

        // Header
        let csv = "Name1;Name2;Kommunikation;Kontakt";
        csv += lineSeparator;

        // Data
        sortedPreOrders.forEach((preOrder: PreOrder) => {
            csv += this.encodeCsv(preOrder.name1);
            csv += csvSeparator;
            csv += this.encodeCsv(preOrder.name2);
            csv += csvSeparator;

            const communication = communications.find((communication: Communication) => communication.id === preOrder.communicationId);
            csv += this.encodeCsv(communication.name);
            csv += csvSeparator;

            csv += preOrder.communicationValue;

            csv += lineSeparator;
        });

        return csv;
    }

    private encodeCsv(value: string): string {
        let encoded = value.replace('"', '""');
        if ((encoded.indexOf('"') >= 0) || (encoded.indexOf(',') >= 0))
        {
            encoded = '"' + encoded + '"';
        }
        return encoded;
    }
}
