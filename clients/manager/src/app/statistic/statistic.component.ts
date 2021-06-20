import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { forkJoin } from "rxjs";

import { OrdersService } from "../service/orders.service";
import { Order } from "../contracts/order";
import { MenusService } from "../service/menus.service";
import { Menu } from "../contracts/menu";
import { ColumnDefinition } from "../contracts/column-definition";
import { StatisticRow } from "../contracts/statistic-row";
import { PreOrder } from "../contracts/pre-order";
import { PreOrdersService } from "../service/pre-orders.service";

@Component({
    selector: "app-statistic",
    templateUrl: "./statistic.component.html",
    styleUrls: ["./statistic.component.scss"]
})
export class StatisticComponent implements OnInit, AfterViewInit {

    @ViewChild(MatSort) sort: MatSort;

    predefinedColumns: ColumnDefinition[] = [
        { id: "title", title: "", align: "left", type: "string" },
        { id: "customers", title: "Kunden", align: "center", type: "string" },
        { id: "portions", title: "Portionen", align: "center", type: "string" },
        { id: "sum", title: "Summe €", align: "center", type: "currency" },
    ];

    menus: Menu[] = [];

    columns: ColumnDefinition[] = [];
    displayedColumns: string[] = [];

    dataSource: MatTableDataSource<StatisticRow> = new MatTableDataSource<StatisticRow>([]);

    constructor(
        private menusService: MenusService,
        private preOrderService: PreOrdersService,
        private orderService: OrdersService) { }

    ngOnInit(): void {
        this.getData();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    refresh(): void {
        this.getData();
    }

    private getData(): void {
        this.dataSource.data = [];
        forkJoin([
            this.menusService.getMenus(),
            this.preOrderService.getPreOrders(),
            this.orderService.getOrders()
        ]).subscribe(responseList => {
            this.processMenus(responseList[0]);
            const preOrderData = this.processPreOrders(responseList[1]);
            const orderPreorderedData = this.processOrdersPreordered(responseList[2]);
            const remainingData = this.calculateRemaining(preOrderData, orderPreorderedData);
            const stockData = this.calculateStock();
            const orderNotPreorderedData = this.processOrdersNotPreordered(responseList[2]);
            const remainingStockData = this.calculateRemainingStock(stockData, preOrderData, orderNotPreorderedData);

            const emptyRow: StatisticRow = { title: "", customers: null, portions: null, sum: null };
            this.dataSource.data = [preOrderData, orderPreorderedData, remainingData, emptyRow,
                stockData, orderNotPreorderedData, remainingStockData];
        });
    }

    private processMenus(menus: Menu[]): void {
        this.menus = menus;

        this.columns = [];
        this.predefinedColumns.forEach(column => {
            this.columns.push({
                id: column.id,
                title: column.title,
                align: column.align,
                type: column.type,
            });
        });

        menus.forEach((menu) => {
            this.columns.push({
                id: menu.id,
                title: menu.name,
                align: "center",
                type: "string",
            });
        });

        this.displayedColumns = [];
        this.columns.forEach(column => {
            this.displayedColumns.push(column.id);
        });
    }

    private processPreOrders(preOrders: PreOrder[]): StatisticRow {
        const data: StatisticRow = {
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

    private processOrdersPreordered(orders: Order[]): StatisticRow {
        return this.processOrdersHelper(orders, true, "Einkäufe mit Vorbestellung");
    }

    private processOrdersNotPreordered(orders: Order[]): StatisticRow {
        return this.processOrdersHelper(orders, false, "Einkäufe ohne Vorbestellung");
    }

    private processOrdersHelper(orders: Order[], preordered: boolean, title: string): StatisticRow {
        const data: StatisticRow = {
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

    private calculateStock(): StatisticRow {
        const data: StatisticRow = {
            title: "Bestand",
            customers: null,
            portions: null,
            sum: 0.0,
        }

        let sum = 0.0;
        this.menus.forEach(menu => {
            data[menu.id] = menu.stock;
            sum += menu.stock * menu.price;
        });

        data.sum = sum;

        return data;
    }

    private calculateRemaining(preOrderData: StatisticRow, orderData: StatisticRow): StatisticRow {
        const data: StatisticRow = {
            title: "Ausstehend",
            customers: 0,
            portions: 0,
            sum: 0.0,
        }

        let portions = 0;
        this.menus.forEach(menu => {
            data[menu.id] = preOrderData[menu.id] - orderData[menu.id];
            portions += data[menu.id];
        });

        data.customers = preOrderData.customers - orderData.customers;
        data.portions = portions;
        data.sum = preOrderData.sum - orderData.sum;

        return data;
    }

    private calculateRemainingStock(stockData: StatisticRow, preOrderData: StatisticRow, orderNotPreorderedData: StatisticRow): StatisticRow {
        const data: StatisticRow = {
            title: "Übrig",
            customers: null,
            portions: null,
            sum: 0.0,
        }

        let sum = 0.0;
        this.menus.forEach(menu => {
            data[menu.id] = stockData[menu.id] - preOrderData[menu.id] - orderNotPreorderedData[menu.id];
            sum += data[menu.id] * menu.price;
        });

        data.sum = sum;

        return data;
    }
}
