import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { forkJoin } from "rxjs";

import { OrdersService } from "../services/orders.service";
import { Order } from "../contracts/order";
import { MenusService } from "../services/menus.service";
import { Menu } from "../contracts/menu";
import { ColumnDefinition } from "../contracts/column-definition";
import { Statistic1Row } from "../contracts/statistic1-row";
import { PreOrder } from "../contracts/pre-order";
import { PreOrdersService } from "../services/pre-orders.service";
import { CommunicationsService } from '../services/communications.service';
import { Communication } from '../contracts/communication';
import { Statistic2Row } from '../contracts/statistic2-row';

@Component({
    selector: "app-statistic",
    templateUrl: "./statistic.component.html",
    styleUrls: ["./statistic.component.scss"]
})
export class StatisticComponent implements OnInit {
    statistic1PredefinedColumns: ColumnDefinition[] = [
        { id: "title", title: "", align: "left", type: "string" },
        { id: "customers", title: "Kunden", align: "center", type: "string" },
        { id: "portions", title: "Portionen", align: "center", type: "string" },
        { id: "sum", title: "Summe €", align: "center", type: "currency" },
    ];

    statistic1Columns: ColumnDefinition[] = [];
    statistic1DisplayedColumns: string[] = [];
    statistic1DataSource: MatTableDataSource<Statistic1Row> = new MatTableDataSource<Statistic1Row>([]);

    statistic2PredefinedColumns: ColumnDefinition[] = [
        { id: "title", title: "", align: "left", type: "string" },
    ];

    statistic2Columns: ColumnDefinition[] = [];
    statistic2DisplayedColumns: string[] = [];
    statistic2DataSource: MatTableDataSource<Statistic2Row> = new MatTableDataSource<Statistic2Row>([]);

    menus: Menu[] = [];
    communications: Communication[] = [];

    constructor(
        private menusService: MenusService,
        private preOrderService: PreOrdersService,
        private orderService: OrdersService,
        private communicationService: CommunicationsService) { }

    ngOnInit(): void {
        this.getStatisticData();
    }

    refresh(): void {
        this.getStatisticData();
    }

    private getStatisticData(): void {
        this.statistic1DataSource.data = [];
        forkJoin([
            this.menusService.getMenus(),
            this.preOrderService.getPreOrders(),
            this.orderService.getOrders(),
            this.communicationService.getCommunications()
        ]).subscribe(responseList => {
            this.processMenus(responseList[0]);
            this.processCommunications(responseList[3]);

            const emptyRow: Statistic1Row = { title: "", customers: null, portions: null, sum: null };

            const preOrdersData = this.calculatePreOrders(responseList[1]);
            const ordersWithPreOrderData = this.calculateOrdersWithPreOrder(responseList[2]);
            const remainingPreOrdersData = this.calculateRemainingPreOrders(responseList[1], responseList[2]);

            const stockData = this.calculateStock();
            const ordersWithouPreOrderData = this.calculateOrdersWithouPreOrder(responseList[2]);
            const remainingStockData = this.calculateRemainingStock(stockData, ordersWithPreOrderData, remainingPreOrdersData, ordersWithouPreOrderData);

            this.statistic1DataSource.data = [
                preOrdersData, ordersWithPreOrderData, remainingPreOrdersData,
                emptyRow,
                stockData, ordersWithouPreOrderData, remainingStockData
            ];

            const communicationData = this.calculateCommunications(responseList[1]);
            this.statistic2DataSource.data = [communicationData];
        });
    }

    private processMenus(menus: Menu[]): void {
        this.menus = menus;

        this.statistic1Columns = [];
        this.statistic1PredefinedColumns.forEach(column => {
            this.statistic1Columns.push({
                id: column.id,
                title: column.title,
                align: column.align,
                type: column.type,
            });
        });

        menus.forEach((menu) => {
            this.statistic1Columns.push({
                id: menu.id,
                title: menu.name,
                align: "center",
                type: "string",
            });
        });

        this.statistic1DisplayedColumns = [];
        this.statistic1Columns.forEach(column => {
            this.statistic1DisplayedColumns.push(column.id);
        });
    }

    private calculatePreOrders(preOrders: PreOrder[]): Statistic1Row {
        const data: Statistic1Row = {
            title: "Vorbestellungen",
            customers: 0,
            portions: 0,
            sum: 0.0,
        }
        this.menus.forEach(menu => {
            data[menu.id] = 0;
        });

        let portions = 0;
        preOrders.forEach(preOrder => {
            this.menus.forEach(menu => {
                const position = preOrder.positions.find(p => p.id === menu.id);
                if (position != null && position.amount !== 0) {
                    data[menu.id] += position.amount;
                    portions += position.amount;
                }
            });
        });

        data.customers = preOrders.length;
        data.portions = portions;

        let sum = 0.0;
        this.menus.forEach(menu => {
            const value = data[menu.id] * menu.price;
            sum += value;
        });

        data.sum = sum;

        return data;
    }

    private calculateOrdersWithPreOrder(orders: Order[]): Statistic1Row {
        return this.processOrdersHelper(orders, true, "Einkäufe mit Vorbestellung");
    }

    private calculateOrdersWithouPreOrder(orders: Order[]): Statistic1Row {
        return this.processOrdersHelper(orders, false, "Einkäufe ohne Vorbestellung");
    }

    private processOrdersHelper(orders: Order[], preordered: boolean, title: string): Statistic1Row {
        const data: Statistic1Row = {
            title,
            customers: 0,
            portions: 0,
            sum: 0.0,
        }
        this.menus.forEach(menu => {
            data[menu.id] = 0;
        });

        let customers = 0;
        let portions = 0;
        orders.forEach(order => {
            if ((preordered && order.preOrderId !== "") ||
                (!preordered && order.preOrderId === "")) {
                this.menus.forEach(menu => {
                    const position = order.positions.find(p => p.id === menu.id);
                    if (position != null && position.amount !== 0) {
                        data[menu.id] += position.amount;
                        portions += position.amount;
                    }
                });
                customers++;
            }
        });

        data.customers = customers;
        data.portions = portions;

        let sum = 0.0;
        this.menus.forEach(menu => {
            const value = data[menu.id] * menu.price;
            sum += value;
        });

        data.sum = sum;

        return data;
    }

    private calculateStock(): Statistic1Row {
        const data: Statistic1Row = {
            title: "Bestand",
            customers: null,
            portions: 0,
            sum: 0.0,
        }

        let portions = 0;
        let sum = 0.0;
        this.menus.forEach(menu => {
            data[menu.id] = menu.stock;
            portions += data[menu.id];
            sum += menu.stock * menu.price;
        });

        data.sum = sum;
        data.portions = portions;

        return data;
    }

    private calculateRemainingPreOrders(preOrders: PreOrder[], orders: Order[]): Statistic1Row {
        const data: Statistic1Row = {
            title: "Ausstehend",
            customers: 0,
            portions: 0,
            sum: 0.0,
        }
        this.menus.forEach(menu => {
            data[menu.id] = 0;
        });

        let customers = 0;
        let portions = 0;
        let sum = 0.0;
        preOrders.forEach(preOrder => {
            if (!orders.find((order: Order) => order.preOrderId === preOrder.id)) {
                this.menus.forEach(menu => {                    
                    const position = preOrder.positions.find(p => p.id === menu.id);
                    if (position != null && position.amount !== 0) {
                        data[menu.id] += position.amount;
                        portions += position.amount;
                        sum += position.amount * menu.price;
                    }
                });           
                customers++;    
            }
        });

        data.customers = customers;
        data.portions = portions;
        data.sum = sum;

        return data;
    }

    private calculateRemainingStock(stockData: Statistic1Row, ordersWithPreOrderData: Statistic1Row, remainingPreOrdersData: Statistic1Row, ordersWithouPreOrderData: Statistic1Row): Statistic1Row {
        const data: Statistic1Row = {
            title: "Übrig",
            customers: null,
            portions: 0,
            sum: 0.0,
        }

        let portions = 0;
        let sum = 0.0;
        this.menus.forEach(menu => {
            data[menu.id] = stockData[menu.id] - ordersWithPreOrderData[menu.id] - remainingPreOrdersData[menu.id] - ordersWithouPreOrderData[menu.id];
            portions += data[menu.id];
            sum += data[menu.id] * menu.price;
        });

        data.sum = sum;
        data.portions = portions;

        return data;
    }

    private processCommunications(communications: Communication[]): void {
        this.communications = communications;

        this.statistic2Columns = [];
        this.statistic2PredefinedColumns.forEach(column => {
            this.statistic2Columns.push({
                id: column.id,
                title: column.title,
                align: column.align,
                type: column.type,
            });
        });

        communications.forEach(communication => {
            this.statistic2Columns.push({
                id: communication.id,
                title: communication.name,
                align: "left",
                type: "string",
            });   
        });

        this.statistic2DisplayedColumns = [];
        this.statistic2Columns.forEach(column => {
            this.statistic2DisplayedColumns.push(column.id);
        });
    }

    private calculateCommunications(preOrders: PreOrder[]): Statistic2Row {
        const data: Statistic2Row = {
            title: "Vorbestellungen",
        }

        this.communications.forEach(communication => {
            data[communication.id] = 0;
        });

        preOrders.forEach(preOrder => {
            data[preOrder.communicationId]++;
        });

        return data;
    }    
}
