import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";

import { MenusService } from "../service/menus.service";
import { Menu } from "../contracts/menu";
import { OrdersService } from "../service/orders.service";
import { PreOrdersService } from "../service/pre-orders.service";
import { PreOrder } from "../contracts/pre-order";
import { Order } from "../contracts/order";
import { OrderPosition } from "../contracts/order-position";

@Component({
    selector: "app-order-form",
    templateUrl: "./order-form.component.html",
    styleUrls: ["./order-form.component.scss"]
})
export class OrderFormComponent implements OnInit {
    form: FormGroup;
    menuItems: FormArray;
    menus: Menu[];
    initialValues: any;
    filter: string;
    selectedValue: PreOrder;
    selectionList: PreOrder[];
    currentPreOrder: string;
    price: number = 0;

    constructor(private formBuilder: FormBuilder, private menusService: MenusService,
        private preOrderService: PreOrdersService, private orderService: OrdersService) { }

    ngOnInit(): void {
        this.currentPreOrder = "";

        this.initForm();
        this.getMenus();
        this.onFilter("");
    }

    private initForm(): void {
        this.menuItems = this.formBuilder.array([]);
        this.form = this.formBuilder.group({
            name1: [""],
            name2: [""],
            comment: [""],
            positions: this.menuItems
        });
    }

    onFilter(filter: string): void {
        this.getPreOrdersByFilter(filter);
    }

    onSelect(preOrder: PreOrder): void {
        this.currentPreOrder = preOrder.id;
        this.getPreOrderById(preOrder.id);
    }

    onBaseDataChanged(text: string): void {
        this.currentPreOrder = "";
    }

    onChange(value: string): void {
        this.updatePrice();
    }

    private getMenus(): void {
        this.menusService.resolveItems().subscribe((menus: Menu[]) => {
            this.menus = menus.sort((a, b) => a.sequence - b.sequence );
            menus.forEach(() => {
                this.menuItems.push(this.formBuilder.control(0));
            });
            this.initialValues = this.form.value;
        });
    }

    private getPreOrdersByFilter(filter: string): void {
        this.preOrderService.getWithoutOrderByName(filter).subscribe((preOrders: PreOrder[]) => {
            this.selectionList = preOrders;
        });
    }

    private getPreOrderById(id: string): void {
        this.preOrderService.getPreOrder(id).subscribe(preOrder => {
            if (preOrder != null) {
                this.form.get("name1").setValue(preOrder.name1);
                this.form.get("name2").setValue(preOrder.name2);
                this.form.get("comment").setValue(preOrder.comment);

                this.menus.forEach((m, i) => {
                    const tempPosition = preOrder.positions.find(p => p.id === m.id);
                    if (tempPosition != null) {
                        this.form.get("positions").get(`${i}`).setValue(tempPosition.amount);
                    }
                });

                this.updatePrice();
            } else {
                console.warn(`PreOrder id "${id}" not found`);
            }
        });
    }

    private updatePrice():void {
        this.price = 0.0;
        this.menus.forEach((menu, index) => {
            const amount = this.form.value.positions[index];
            this.price += amount * menu.price;
        });        
    }

    onSubmit(): void {
        const order: Order = {
            name1: this.form.value.name1,
            name2: this.form.value.name2,
            comment: this.form.value.comment,
            datetime: new Date().toISOString(),
            preOrderId: this.currentPreOrder,
            positions: [],
        }

        this.menus.forEach((menu, index) => {
            const orderPosition: OrderPosition = {
                id: menu.id,
                amount: this.form.value.positions[index],
            }
            order.positions.push(orderPosition);
        });

        console.log("New order");
        console.log(order);
        this.orderService.submitOrder(order).subscribe();

        setTimeout(() => this.reset(), 0);
    }

    reset(): void {
        this.form.reset(this.initialValues);

        this.currentPreOrder = "";
        this.filter = "";
        this.onFilter("");
        this.updatePrice();
    }
}
