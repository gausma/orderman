import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { forkJoin, Subscription } from "rxjs";

import { PreOrdersService } from "../../services/pre-orders.service";
import { PreOrder } from "../../contracts/pre-order";
import { MenusService } from "../../services/menus.service";
import { Menu } from "../../contracts/menu";
import { ColumnDefinition } from "../../contracts/column-definition";
import { EventsService } from "../../services/events.service";
import { Event } from "../../contracts/event";
import { CommunicationsService } from "../../services/communications.service";
import { Communication } from "../../contracts/communication";
import { OrdersService } from "../../services/orders.service";
import { PreOrderRow } from "../../contracts/pre-order-row";
import { Order } from "../../contracts/order";
import { PreOrderPosition } from "../../contracts/pre-order-position";
import { AuthenticationsService } from '../../services/authentications.service';
import { AuthenticationCredentials } from '../../contracts/authentication-credentials';

@Component({
    selector: "app-pre-order-list",
    templateUrl: "./pre-order-list.component.html",
    styleUrls: ["./pre-order-list.component.scss"]
})
export class PreOrderListComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatSort) sort: MatSort;

    predefinedColumns: ColumnDefinition[] = [
        { id: "orderExists", title: $localize`Verkauft`, align: "center", type: "string" },
        { id: "name1", title: $localize`Name`, align: "left", type: "string" },
        { id: "name2", title: $localize`Vorname`, align: "left", type: "string" },
        { id: "comment", title: $localize`Bemerkung`, align: "left", type: "string" },
        { id: "eventId", title: $localize`Ereignis`, align: "left", type: "string" },
        { id: "communicationId", title: $localize`Kommunikation`, align: "left", type: "string" },
        { id: "communicationValue", title: $localize`Info`, align: "left", type: "string" },
        { id: "datetime", title: $localize`Erstellt`, align: "left", type: "date" },
        { id: "sum", title: $localize`Summe`, align: "center", type: "currency" },
    ];

    events: Event[] = [];
    communications: Communication[] = [];
    menus: Menu[] = [];
    orders: Order[] = [];
    preOrders: PreOrder[] = [];

    columns: ColumnDefinition[] = [];
    displayedColumns: string[] = [];

    dataSource: MatTableDataSource<PreOrderRow> = new MatTableDataSource<PreOrderRow>([]);
    selection = new SelectionModel<PreOrderRow>(false, []);

    public credentials: AuthenticationCredentials;
    private authenticationSubscription: Subscription;

    constructor(
        private authenticationsService: AuthenticationsService,
        private eventService: EventsService,
        private communicationService: CommunicationsService,
        private menusService: MenusService,
        private preOrderService: PreOrdersService,
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
        this.router.navigate(["preorderform"]);
    }

    edit(): void {
        if (!this.selection.isEmpty()) {
            this.router.navigate(["preorderform"], { queryParams: { preOrderId: this.selection.selected[0].id } });
        }
    }

    delete(): void {
        if (this.selection.selected.length > 0) {
            this.preOrderService.deletePreOrder(this.selection.selected[0].id).subscribe(() => {
                this.selection.clear();
                this.getData();
            });
        }
    }

    createOrder(): void {
        if (!this.selection.isEmpty()) {
            const preOrder = this.preOrders.find(p => p.id === this.selection.selected[0].id);

            const order: Order = {
                name1: preOrder.name1,
                name2: preOrder.name2,
                comment: preOrder.comment,
                eventId: preOrder.eventId,
                datetime: new Date().toISOString(),
                positions: [],
                preOrderId: preOrder.id,
            };

            preOrder.positions.forEach((p: PreOrderPosition) => {
                order.positions.push({
                    id: p.id,
                    amount: p.amount,
                });
            });

            this.orderService.createOrder(order).subscribe(() => {
                this.getData();
                // this.router.navigate(["orderlist"]);
            });
        }
    }

    private getData(): void {
        forkJoin([
            this.eventService.getEvents(),
            this.communicationService.getCommunications(),
            this.menusService.getMenus(),
            this.orderService.getOrders(),
            this.preOrderService.getPreOrders(),
        ]).subscribe(responseList => {
            this.processEvents(responseList[0]);
            this.processCommunications(responseList[1]);
            this.processMenus(responseList[2]);
            this.processOrders(responseList[3]);
            this.processPreOrders(responseList[4]);
        });
    }

    private processEvents(events: Event[]): void {
        this.events = events;
    }

    private processCommunications(communications: Communication[]): void {
        this.communications = communications;
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
        this.orders = orders;
    }

    private processPreOrders(preOrders: PreOrder[]): void {
        this.preOrders = preOrders;

        const data: PreOrderRow[] = [];
        this.preOrders.forEach(preOrder => {
            const event = this.events.find(e => e.id === preOrder.eventId);
            const communication = this.communications.find(c => c.id === preOrder.communicationId);

            const element: PreOrderRow = {
                id: preOrder.id,
                orderExists: "",
                name1: preOrder.name1,
                name2: preOrder.name2,
                comment: preOrder.comment,
                eventId: event.name,
                communicationId: communication.name,
                communicationValue: preOrder.communicationValue,
                datetime: preOrder.datetime,
                sum: 0.0,
            };

            this.menus.forEach(menu => {
                const position = preOrder.positions.find(p => p.id === menu.id);
                element[menu.id] = "";
                if (position != null && position.amount !== 0) {
                    element[menu.id] = position.amount;
                    element.sum += position.amount * menu.price;
                }
            });

            const orderExists = this.orders.find(o => o.preOrderId === preOrder.id);
            element.orderExists = orderExists == null ? "" : "✓";

            data.push(element);
        });

        this.dataSource.data = data;
    }
}
