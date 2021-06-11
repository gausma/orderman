import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { OrdersService } from '../service/orders.service';
import { Order } from '../contracts/order';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MenusService } from '../service/menus.service';
import { forkJoin } from 'rxjs';
import { Menu } from '../contracts/menu';
import { ColumnDefinition } from '../contracts/column-definition';
import { StatisticRow } from 'src/app/contracts/statistic-row';
import { PreOrder } from 'src/app/contracts/pre-order';
import { PreOrdersService } from 'src/app/service/pre-orders.service';

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit, AfterViewInit {

    @ViewChild(MatSort) sort: MatSort;

    predefinedColumns: ColumnDefinition[] = [
        { id: 'title', title: '', align: 'left', type: 'string' },
        { id: 'sum', title: 'Summe', align: 'center', type: 'string' },
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
            const orderData = this.processOrders(responseList[2]);
            const remainingData = this.calculateRemaining(preOrderData, orderData);
            const earningData = this.calculateEarnings(orderData);

            const emptyRow: StatisticRow = { title: "", sum: "" };
            this.dataSource.data = [preOrderData, orderData, emptyRow, remainingData, earningData];        
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
                type: 'string',
            });
        });

        menus.forEach((menu) => {
            this.columns.push({
                id: menu.id,
                title: menu.name,
                align: 'center',
                type: 'string',
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
            sum: "",
        }
        this.menus.forEach(menu => {
            data[menu.id] = 0;
        });

        preOrders.forEach(preOrder => {
            this.menus.forEach(menu => {
                const position = preOrder.positions.find(p => p.id === menu.id);
                if (position != null && position.amount !== 0) {
                    data[menu.id] += position.amount;
                }
            });            
        });

        return data;
    }

    private processOrders(orders: Order[]): StatisticRow {
        const data: StatisticRow = {
            title: "Einkäufe",
            sum: "",
        }
        this.menus.forEach(menu => {
            data[menu.id] = 0;
        });

        orders.forEach(order => {
            this.menus.forEach(menu => {
                const position = order.positions.find(p => p.id === menu.id);
                if (position != null && position.amount !== 0) {
                    data[menu.id] += position.amount;
                }
            });            
        });

        return data;
    }

    private calculateRemaining(preOrderData: StatisticRow, orderData: StatisticRow): StatisticRow {
        const remainingData: StatisticRow = {
            title: "Ausstehend",
            sum: "",
        }

        this.menus.forEach(menu => {
            remainingData[menu.id] = preOrderData[menu.id] - orderData[menu.id];
        });

        return remainingData;
    }    

    private calculateEarnings(orderData: StatisticRow): StatisticRow {
        const earningData: StatisticRow = {
            title: "Einnahmen",
            sum: "0.00",
        }

        let sum = 0.0;
        this.menus.forEach(menu => {
            const value = orderData[menu.id] * menu.price;
            earningData[menu.id] = value.toFixed(2);
            sum += value;
        });

        earningData.sum = sum.toFixed(2);

        return earningData;
    }  
}
