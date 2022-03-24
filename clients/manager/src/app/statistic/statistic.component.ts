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
import { EventsService } from '../services/events.service';
import { Event } from "../contracts/event";

@Component({
    selector: "app-statistic",
    templateUrl: "./statistic.component.html",
    styleUrls: ["./statistic.component.scss"]
})
export class StatisticComponent implements OnInit {
    statistic1PredefinedColumns: ColumnDefinition[] = [
        { id: "title", title: "", align: "left", type: "string" },
        { id: "customers", title: $localize`Kunden`, align: "center", type: "string" },
        { id: "portions", title: $localize`Portionen`, align: "center", type: "string" },
        { id: "sum", title: $localize`Summe €`, align: "center", type: "currency" },
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
        private communicationService: CommunicationsService,
        private eventsService: EventsService) { }

    ngOnInit(): void {
        this.getStatisticData();
    }

    refresh(): void {
        this.getStatisticData();
    }

    private getStatisticData(): void {
        this.statistic1DataSource.data = [];
        this.statistic2DataSource.data = [];

        forkJoin([
            this.menusService.getMenus(),
            this.preOrderService.getPreOrders(),
            this.orderService.getOrders(),
            this.communicationService.getCommunications(),
            this.eventsService.getEvents(),
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

            const ordersData = this.calculateOrders(responseList[2]);

            const tempData = [];

            tempData.push(preOrdersData);
            if (responseList[4].length > 1) {
                const preOrdersDataByEvent = this.calculatePreOrdersByEvent(responseList[1], responseList[4]);
                tempData.push(...preOrdersDataByEvent);
            }            

            tempData.push(ordersWithPreOrderData);
            tempData.push(remainingPreOrdersData);
            if (responseList[4].length > 1) {
                const remainingPreOrdersDataByEvent = this.calculateRemainingPreOrdersByEvent(responseList[1], responseList[2], responseList[4]);
                tempData.push(...remainingPreOrdersDataByEvent);
            }            

            tempData.push(emptyRow);

            tempData.push(stockData);
            tempData.push(preOrdersData);
            tempData.push(ordersWithouPreOrderData);
            tempData.push(remainingStockData);

            tempData.push(emptyRow);

            tempData.push(ordersWithPreOrderData);
            tempData.push(ordersWithouPreOrderData);
            tempData.push(ordersData);

            if (responseList[4].length > 1) {
                const ordersDataByEvent = this.calculateOrdersByEvent(responseList[2], responseList[4]);
                tempData.push(...ordersDataByEvent);
            }            

            this.statistic1DataSource.data = tempData;

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
            title: $localize`Vorbestellungen`,
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

    private calculatePreOrdersByEvent(preOrders: PreOrder[], events: Event[]): Statistic1Row[] {
        const datas: Statistic1Row[] = [];

        events.forEach(event => {
            const data: Statistic1Row = {
                title: `... ${event.name}`,
                customers: 0,
                portions: 0,
                sum: 0.0,
            }
            this.menus.forEach(menu => {
                data[menu.id] = 0;
            });
    
            let customers = 0;
            let portions = 0;            
            preOrders.forEach(preOrder => {
                if (event.id === preOrder.eventId) {
                    this.menus.forEach(menu => {
                        const position = preOrder.positions.find(p => p.id === menu.id);
                        if (position != null && position.amount !== 0) {
                            data[menu.id] += position.amount;
                            portions += position.amount;
                        }
                    });
                    customers += 1;
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

            datas.push(data);
        });

        return datas;
    }

    private calculateOrdersWithPreOrder(orders: Order[]): Statistic1Row {
        return this.processOrdersHelper(orders, 1, $localize`Einkäufe mit Vorbestellung`);
    }

    private calculateOrdersWithouPreOrder(orders: Order[]): Statistic1Row {
        return this.processOrdersHelper(orders, 2, $localize`Einkäufe ohne Vorbestellung`);
    }

    private calculateOrders(orders: Order[]): Statistic1Row {
        return this.processOrdersHelper(orders, 3, $localize`Einkäufe`);
    }

    private processOrdersHelper(orders: Order[], mode: number, title: string): Statistic1Row {
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
            if ((mode === 1 && order.preOrderId !== "") ||
                (mode === 2 && order.preOrderId === "") ||
                (mode === 3)) {
                this.menus.forEach(menu => {
                    const position = order.positions.find(p => p.id === menu.id);
                    if (position != null && position.amount !== 0) {
                        data[menu.id] += position.amount;
                        portions += position.amount;
                    }
                });
                customers += 1;
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

    private calculateOrdersByEvent(orders: Order[], events: Event[]): Statistic1Row[] {
        const datas: Statistic1Row[] = [];

        events.forEach(event => {
            const data: Statistic1Row = {
                title: `... ${event.name}`,
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
                if (event.id === order.eventId) {
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

            datas.push(data);
        });

        return datas;
    }

    private calculateStock(): Statistic1Row {
        const data: Statistic1Row = {
            title: $localize`Bestand`,
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
            title: $localize`Ausstehende Vorbestellungen`,
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

    private calculateRemainingPreOrdersByEvent(preOrders: PreOrder[], orders: Order[], events: Event[]): Statistic1Row[] {
        const datas: Statistic1Row[] = [];

        events.forEach(event => {
            const data: Statistic1Row = {
                title: `... ${event.name}`,
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
                if (event.id === preOrder.eventId) {
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
                }
            });

            data.customers = customers;
            data.portions = portions;
            data.sum = sum;

            datas.push(data);
        });

        return datas;
    }

    private calculateRemainingStock(stockData: Statistic1Row, ordersWithPreOrderData: Statistic1Row, remainingPreOrdersData: Statistic1Row, ordersWithouPreOrderData: Statistic1Row): Statistic1Row {
        const data: Statistic1Row = {
            title: $localize`Übrig`,
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
            title: $localize`Vorbestellungen`,
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
