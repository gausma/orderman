import { Component, OnInit, Renderer2 } from "@angular/core";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { MenusService } from "../../services/menus.service";
import { OrdersService } from "../../services/orders.service";
import { EventsService } from "../../services/events.service";
import { Menu } from "../../contracts/menu";
import { Order } from "../../contracts/order";
import { Event } from "../../contracts/event";

@Component({
    selector: "app-order-form",
    templateUrl: "./order-form.component.html",
    styleUrls: ["./order-form.component.scss"]
})
export class OrderFormComponent implements OnInit {
    orderId: string;
    preOrderId: string;

    title: string;
    command: string;

    form: FormGroup;
    menuItems: FormArray;
    eventItems: FormArray;

    menus: Menu[];
    events: Event[];

    initialValues: any;

    constructor(private formBuilder: FormBuilder,
                private menusService: MenusService,
                private orderService: OrdersService,
                private eventsService: EventsService,
                private route: ActivatedRoute,
                private router: Router,
                private renderer: Renderer2) { }

    async ngOnInit(): Promise<void> {
        this.initForm();

        await this.getEvents();
        await this.getMenus();
        
        this.initMode();

        this.renderer.selectRootElement('#name1').focus()
    }

    private initForm(): void {
        this.menuItems = this.formBuilder.array([]);        
        this.eventItems = this.formBuilder.array([]);
        this.form = this.formBuilder.group({
            name1: [""],
            name2: [""],
            comment: [""],
            event: [""],
            positions: this.menuItems,
        });
    }

    private async getEvents(): Promise<void> {
        const events = await this.eventsService.getEvents().toPromise();
        this.events = events.sort((a: Event, b: Event) => {
            if (a.name === b.name) {
                return 0;
            } else if (a.name < b.name) {
                return -1;
            } else {
                return 1;
            }
        });
        if (this.events.length > 0) {
            this.form.get("event").setValue(this.events[0]);
        }
    }

    private async getMenus(): Promise<void> {
        this.menus = await this.menusService.getMenus().toPromise();
        this.menus.forEach(() => {
            this.menuItems.push(this.formBuilder.control(0));
        });
    }

    private initMode(): void {
        this.route.queryParams.subscribe(params => {
            this.orderId = params.orderId;
            if (this.orderId == null) {
                // Create
                this.title = $localize`Einkauf erstellen`;
                this.command = $localize`Erstellen`;

                this.preOrderId = "";
                this.initialValues = this.form.value;
            } else {
                // Edit
                this.title = $localize`Einkauf bearbeiten`;
                this.command = $localize`Aktualisieren`;

                this.evalOrder();
            }
        });
    }

    private evalOrder(): void {
        this.orderService.getOrder(this.orderId).subscribe(order => {
            this.preOrderId = order.preOrderId;

            this.form.get("name1").setValue(order.name1);
            this.form.get("name2").setValue(order.name2);
            this.form.get("comment").setValue(order.comment);

            const event = this.events.find(e => e.id === order.eventId);
            this.form.get("event").setValue(event);

            this.menus.forEach((m, i) => {
                const tempPosition = order.positions.find(p => p.id === m.id);
                if (tempPosition != null) {
                    this.form.get("positions").get(`${i}`).setValue(tempPosition.amount);
                }
            });

            this.initialValues = this.form.value;
        });
    }

    submit(): void {
        const order: Order = {
            name1: this.form.value.name1,
            name2: this.form.value.name2,
            comment: this.form.value.comment,
            eventId: this.form.value.event.id,
            datetime: new Date().toISOString(),
            positions: [],
            preOrderId: this.preOrderId,
        };

        this.form.value.positions.forEach((p: number, i: number) => {
            order.positions.push({
                id: this.menus[i].id,
                amount: p,
            });
        });
console.log(order);
        if (this.orderId == null) {
            this.orderService.createOrder(order).subscribe(() => {
                this.router.navigate(["orderlist"]);
            });
        } else {
            this.orderService.updateOrder(this.orderId, order).subscribe(() => {
                this.router.navigate(["orderlist"]);
            });
        }
    }

    cancel(): void {
        this.router.navigate(["orderlist"]);
    }

    reset(): void {
        this.form.reset(this.initialValues);
    }
}
