import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { OrdersService } from '../../service/orders.service';
import { Order } from '../../contracts/order';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MenusService } from '../../service/menus.service';
import { forkJoin } from 'rxjs';
import { Menu } from '../../contracts/menu';
import { ColumnDefinition } from '../../contracts/column-definition';
import { OrderRow } from 'src/app/contracts/order-row';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, AfterViewInit {

    @ViewChild(MatSort) sort: MatSort;

    predefinedColumns: ColumnDefinition[] = [
        { id: 'name1', title: 'Name', align: 'left', type: 'string' },
        { id: 'name2', title: 'Vorname', align: 'left', type: 'string' },
        { id: 'comment', title: 'Bemerkung', align: 'left', type: 'string' },
    ];

    menus: Menu[] = [];

    columns: ColumnDefinition[] = [];
    displayedColumns: string[] = [];

    dataSource: MatTableDataSource<OrderRow> = new MatTableDataSource<OrderRow>([]);
    selection = new SelectionModel<OrderRow>(false, []);

    constructor(
        private menusService: MenusService,
        private orderService: OrdersService,
        private router: Router) { }

    ngOnInit(): void {
        this.getData();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    doFilter(value: string): void {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }

    add(): void {
        this.router.navigate(['orderform']);
    }

    edit(): void {
        if (!this.selection.isEmpty()) {
            this.router.navigate(['orderform'], { queryParams: { orderId: this.selection.selected[0].id } });
        }
    }

    delete(): void {
        if (this.selection.selected.length > 0) {
            this.orderService.deleteOrder(this.selection.selected[0].id).subscribe(() => {
                this.selection.clear();
                this.getData();
            });
        }
    }

    private getData(): void {
        forkJoin([
            this.menusService.getMenus(),
            this.orderService.getOrders()
        ]).subscribe(responseList => {
            this.processMenus(responseList[0]);
            this.processOrders(responseList[1]);
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

    private processOrders(orders: Order[]): void {
        const data: OrderRow[] = [];
        orders.forEach(order => {
            const element: OrderRow = {
                id: order.id,
                name1: order.name1,
                name2: order.name2,
                comment: order.comment,
            };

            this.menus.forEach(menu => {
                const position = order.positions.find(p => p.id === menu.id);
                element[menu.id] = '';
                if (position != null && position.amount !== 0) {
                    element[menu.id] = position.amount;
                }
            });

            data.push(element);
        });

        this.dataSource.data = data;
    }
}
