import { Injectable } from '@nestjs/common';
import { Backup } from './contracts/Backup';
import { CommunicationsService } from '../communications/communications.service';
import { MenusService } from '../menus/menus.service';
import { OrdersService } from '../orders/orders.service';
import { PreOrdersService } from '../pre-orders/pre-orders.service';
import * as _ from 'lodash';

@Injectable()
export class BackupsService {
    constructor(
        private communicationsService: CommunicationsService,
        private menusService: MenusService,
        private ordersService: OrdersService,
        private preOrdersService: PreOrdersService) {
        }

    async get(): Promise<Backup> {
        const backup: Backup = {
            communications: await this.communicationsService.getAll(),
            menus: await this.menusService.getAll(),
            orders: await this.ordersService.getAll(),
            preOrders: await this.preOrdersService.getAll(),
        }
        return backup;
    }

    async create(backup: Backup): Promise<void> {
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
}
