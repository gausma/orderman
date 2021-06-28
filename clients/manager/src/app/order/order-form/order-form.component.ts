import { Component, OnInit, Renderer2 } from "@angular/core";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { MenusService } from "../../service/menus.service";
import { OrdersService } from "../../service/orders.service";
import { Menu } from "../../contracts/menu";
import { Order } from "../../contracts/order";

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
    menus: Menu[];

    initialValues: any;

    constructor(private formBuilder: FormBuilder,
                private menusService: MenusService,
                private orderService: OrdersService,
                private route: ActivatedRoute,
                private router: Router,
                private renderer: Renderer2) { }

    async ngOnInit(): Promise<void> {
        this.initForm();

        await this.getMenus();
        
        this.initMode();

        this.renderer.selectRootElement('#name1').focus()
    }

    private initForm(): void {
        this.menuItems = this.formBuilder.array([]);        
        this.form = this.formBuilder.group({
            name1: [""],
            name2: [""],
            comment: [""],
            positions: this.menuItems,
        });
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
                this.title = "Einkauf erstellen";
                this.command = "Erstellen";

                this.preOrderId = "";
                this.initialValues = this.form.value;
            } else {
                // Edit
                this.title = "Einkauf bearbeiten";
                this.command = "Aktualisieren";

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
