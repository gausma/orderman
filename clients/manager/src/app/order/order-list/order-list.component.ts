import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { forkJoin, Subscription } from "rxjs";

import { OrdersService } from "../../services/orders.service";
import { Order } from "../../contracts/order";
import { EventsService } from "../../services/events.service";
import { Event } from "../../contracts/event";
import { MenusService } from "../../services/menus.service";
import { Menu } from "../../contracts/menu";
import { ColumnDefinition } from "../../contracts/column-definition";
import { OrderRow } from "../../contracts/order-row";
import { AuthenticationsService } from '../../services/authentications.service';
import { AuthenticationCredentials } from '../../contracts/authentication-credentials';

@Component({
    selector: "app-order-list",
    templateUrl: "./order-list.component.html",
    styleUrls: ["./order-list.component.scss"]
})
export class OrderListComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatSort) sort: MatSort;

    predefinedColumns: ColumnDefinition[] = [
        { id: "preOrderExists", title: $localize`Vorbestellung`, align: "center", type: "string" },
        { id: "name1", title: $localize`Name`, align: "left", type: "string" },
        { id: "name2", title: $localize`Vorname`, align: "left", type: "string" },
        { id: "comment", title: $localize`Bemerkung`, align: "left", type: "string" },
        { id: "eventId", title: $localize`Ereignis`, align: "left", type: "string" },
        { id: "datetime", title: $localize`Erstellt`, align: "left", type: "date" },
        { id: "sum", title: $localize`Summe`, align: "center", type: "currency" },
    ];

    events: Event[] = [];
    menus: Menu[] = [];

    columns: ColumnDefinition[] = [];
    displayedColumns: string[] = [];

    dataSource: MatTableDataSource<OrderRow> = new MatTableDataSource<OrderRow>([]);
    selection = new SelectionModel<OrderRow>(false, []);

    public credentials: AuthenticationCredentials;
    private authenticationSubscription: Subscription;

    constructor(
        private authenticationsService: AuthenticationsService,
        private eventService: EventsService,
        private menusService: MenusService,
        private orderService: OrdersService,
        private router: Router) { }

    ngOnInit(): void {
        this.authenticationSubscription = this.authenticationsService.authentications$.subscribe(a => this.credentials = a.credentials);
        this.getData();
    }

    ngAfterViewInit(): void {
        this.sort.sort({id: "datetime", start: "desc", disableClear: false});
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy() {
        this.authenticationSubscription.unsubscribe();
    }

    doFilter(value: string): void {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    
    refresh() {
        this.selection.clear();
        this.getData();
    }

    add(): void {
        this.router.navigate(["orderform"]);
    }

    edit(): void {
        if (!this.selection.isEmpty()) {
            this.router.navigate(["orderform"], { queryParams: { orderId: this.selection.selected[0].id } });
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
            this.eventService.getEvents(),
            this.menusService.getMenus(),
            this.orderService.getOrders()
        ]).subscribe(responseList => {
            this.processEvents(responseList[0]);
            this.processMenus(responseList[1]);
            this.processOrders(responseList[2]);
        });
    }

    private processEvents(events: Event[]): void {
        this.events = events;
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

    private processOrders(orders: Order[]): void {
        const data: OrderRow[] = [];
        orders.forEach(order => {
            const event = this.events.find(e => e.id === order.eventId);

            const element: OrderRow = {
                id: order.id,
                preOrderExists: order.preOrderId === "" ? "" : "✓",
                name1: order.name1,
                name2: order.name2,
                comment: order.comment,
                eventId: event.name,
                datetime: order.datetime,
                sum: 0.0,
            };

            this.menus.forEach(menu => {
                const position = order.positions.find(p => p.id === menu.id);
                element[menu.id] = "";
                if (position != null && position.amount !== 0) {
                    element[menu.id] = position.amount;
                    element.sum += position.amount * menu.price;
                }
            });

            data.push(element);
        });

        this.dataSource.data = data;
    }
}
