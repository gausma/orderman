import { Component, OnInit, Renderer2, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormArray, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { MenusService } from "../../services/menus.service";
import { PreOrdersService } from "../../services/pre-orders.service";
import { CommunicationsService } from "../../services/communications.service";
import { Menu } from "../../contracts/menu";
import { Communication } from "../../contracts/communication";
import { PreOrder } from "../../contracts/pre-order";

@Component({
    selector: "app-pre-order-form",
    templateUrl: "./pre-order-form.component.html",
    styleUrls: ["./pre-order-form.component.scss"]
})
export class PreOrderFormComponent implements OnInit {
    preOrderId: string;

    title: string;
    command: string;

    form: FormGroup;
    menuItems: FormArray;
    communicationItems: FormArray;

    menus: Menu[];
    communications: Communication[];

    initialValues: any;

    constructor(private formBuilder: FormBuilder,
                private menusService: MenusService,
                private preOrderService: PreOrdersService,
                private communicationsService: CommunicationsService,
                private route: ActivatedRoute,
                private router: Router,
                private renderer: Renderer2) { }

    async ngOnInit(): Promise<void> {
        this.initForm();

        await this.getCommunications();
        await this.getMenus();

        this.initMode();

        this.renderer.selectRootElement('#name1').focus()
    }

    private initForm(): void {
        this.menuItems = this.formBuilder.array([]);
        this.communicationItems = this.formBuilder.array([]);
        this.form = this.formBuilder.group({
            name1: [""],
            name2: [""],
            comment: [""],
            communication: [""],
            communicationValue: [""],
            positions: this.menuItems,
        });
    }

    private async getCommunications(): Promise<void> {
        const communications = await this.communicationsService.getCommunications().toPromise();
        this.communications = communications.sort((a: Communication, b: Communication) => {
            if (a.name === b.name) {
                return 0;
            } else if (a.name < b.name) {
                return -1;
            } else {
                return 1;
            }
        });
        if (this.communications.length > 0) {
            this.form.get("communication").setValue(this.communications[0]);
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
            this.preOrderId = params.preOrderId;
            if (this.preOrderId == null) {
                // Create
                this.title = $localize`Vorbestellung erstellen`;
                this.command = $localize`Erstellen`;

                this.initialValues = this.form.value;
            } else {
                // Edit
                this.title = $localize`Vorbestellung bearbeiten`;
                this.command = $localize`Aktualisieren`;

                this.evalPreOrder();
            }
        });
    }

    private evalPreOrder(): void {
        this.preOrderService.getPreOrder(this.preOrderId).subscribe(preOrder => {
            this.form.get("name1").setValue(preOrder.name1);
            this.form.get("name2").setValue(preOrder.name2);
            this.form.get("comment").setValue(preOrder.comment);
            this.form.get("communicationValue").setValue(preOrder.communicationValue);

            const communication = this.communications.find(c => c.id === preOrder.communicationId);
            this.form.get("communication").setValue(communication);

            this.menus.forEach((m, i) => {
                const tempPosition = preOrder.positions.find(p => p.id === m.id);
                if (tempPosition != null) {
                    this.form.get("positions").get(`${i}`).setValue(tempPosition.amount);
                }
            });

            this.initialValues = this.form.value;
        });
    }

    submit(): void {
        const preOrder: PreOrder = {
            name1: this.form.value.name1,
            name2: this.form.value.name2,
            comment: this.form.value.comment,
            communicationId: this.form.value.communication.id,
            communicationValue: this.form.value.communicationValue,
            datetime: new Date().toISOString(),
            positions: [],
        };

        this.form.value.positions.forEach((p: number, i: number) => {
            preOrder.positions.push({
                id: this.menus[i].id,
                amount: p,
            });
        });

        if (this.preOrderId == null) {
            this.preOrderService.createPreOrder(preOrder).subscribe(() => {
                this.router.navigate(["preorderlist"]);
            });
        } else {
            this.preOrderService.updatePreOrder(this.preOrderId, preOrder).subscribe(() => {
                this.router.navigate(["preorderlist"]);
            });
        }
    }

    cancel(): void {
        this.router.navigate(["preorderlist"]);
    }

    reset(): void {
        this.form.reset(this.initialValues);
    }
}
