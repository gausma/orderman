import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';

import { OrdersService } from '../../service/orders.service';
import { Order } from '../../contracts/order';
import { MenusService } from '../../service/menus.service';
import { Menu } from '../../contracts/menu';
import { ColumnDefinition } from '../../contracts/column-definition';
import { OrderRow } from '../../contracts/order-row';
import { LoginService } from '../../service/login.service';
import { Credentials } from '../../contracts/credentials';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatSort) sort: MatSort;

    predefinedColumns: ColumnDefinition[] = [
        { id: 'preOrderExists', title: 'Vorbestellung', align: 'center', type: 'string' },
        { id: 'name1', title: 'Name', align: 'left', type: 'string' },
        { id: 'name2', title: 'Vorname', align: 'left', type: 'string' },
        { id: 'comment', title: 'Bemerkung', align: 'left', type: 'string' },
    ];

    menus: Menu[] = [];

    columns: ColumnDefinition[] = [];
    displayedColumns: string[] = [];

    dataSource: MatTableDataSource<OrderRow> = new MatTableDataSource<OrderRow>([]);
    selection = new SelectionModel<OrderRow>(false, []);

    public credentials: Credentials;
    private credentialSubscription: Subscription;

    constructor(
        private loginService: LoginService,
        private menusService: MenusService,
        private orderService: OrdersService,
        private router: Router) { }

    ngOnInit(): void {
        this.credentialSubscription = this.loginService.credentials$.subscribe(c => this.credentials = c);
        this.getData();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy() {
        this.credentialSubscription.unsubscribe();
    }

    doFilter(value: string): void {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    
    refresh() {
        this.selection.clear();
        this.getData();
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
                preOrderExists: order.preOrderId === "" ? "" : "✓",
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
