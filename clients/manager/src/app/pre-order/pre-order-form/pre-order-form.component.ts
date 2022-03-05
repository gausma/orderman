import { Component, OnInit, Renderer2, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, AbstractControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

import { ConfigurationService } from "../../services/configuration.service";
import { MenusService } from "../../services/menus.service";
import { PreOrdersService } from "../../services/pre-orders.service";
import { EventsService } from "../../services/events.service";
import { CommunicationsService } from "../../services/communications.service";
import { Menu } from "../../contracts/menu";
import { Event } from "../../contracts/event";
import { Communication } from "../../contracts/communication";
import { PreOrder } from "../../contracts/pre-order";
import { PreOrderAddDialogComponent } from '../pre-order-add-dialog/pre-order-add-dialog.component';

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
    eventItems: FormArray;
    communicationItems: FormArray;

    menus: Menu[];
    events: Event[];
    communications: Communication[];

    initialValues: any;

    constructor(public dialog: MatDialog,
                private formBuilder: FormBuilder,
                private configurationService: ConfigurationService,
                private menusService: MenusService,
                private preOrderService: PreOrdersService,
                private eventsService: EventsService,
                private communicationsService: CommunicationsService,
                private route: ActivatedRoute,
                private router: Router,
                private renderer: Renderer2) { }

    async ngOnInit(): Promise<void> {
        this.initForm();

        await this.getEvents();
        await this.getCommunications();
        await this.getMenus();

        this.initMode();

        this.renderer.selectRootElement('#name1').focus()
    }

    private initForm(): void {
        this.menuItems = this.formBuilder.array([]);
        this.eventItems = this.formBuilder.array([]);
        this.communicationItems = this.formBuilder.array([]);
        this.form = this.formBuilder.group({
            name1: [""],
            name2: [""],
            comment: [""],
            event: [""],
            communication: [""],
            communicationValue: [""],
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

    addFromText(): void {
        const dialogRef = this.dialog.open(PreOrderAddDialogComponent, {
            width: "750px"
        });

        dialogRef.afterClosed().subscribe((info) => {
            if (info == null) {               
                return;
            }

            this.analyseText(info.text);
        });    
    }

    private async analyseText(text: string): Promise<void> {     
        if (text == null) {
            return;
        }

        const configuration = await this.configurationService.getConfiguration().toPromise();

        // Name
        this.resolveControlValue(this.form.get("name1"), text, configuration.analyseText.scan.name1, "text");
        this.resolveControlValue(this.form.get("name2"), text, configuration.analyseText.scan.name2, "text");

        // Menus
        this.menus.forEach((m, i) => {
            const configMenu = configuration.analyseText.scan.menus.find(cm => cm.name == m.name);
            if (configMenu != null) {
                const control = this.form.get("positions").get(`${i}`);
                this.resolveControlValue(control, text, configMenu.pattern, "number");
            }
        });

       // Event
       var eventName = configuration.analyseText.scan.eventNameDefault;
       configuration.analyseText.scan.events.forEach((c) => {
           var regex = new RegExp(c.pattern);
           const match = text.match(regex);
           if (match != null) {
               eventName = c.name;
           }            
       });

       const event = this.events.find(c => c.name === eventName);
       if (event != null) {
           this.form.get("event").setValue(event);
       }

        // Kommunikation
        this.resolveControlValue(this.form.get("communicationValue"), text, configuration.analyseText.scan.communicationValue, "text");

        var communicationName = configuration.analyseText.scan.communicationNameDefault;
        configuration.analyseText.scan.communications.forEach((c) => {
            var regex = new RegExp(c.pattern);
            const match = text.match(regex);
            if (match != null) {
                communicationName = c.name;
            }            
        });

        const communication = this.communications.find(c => c.name === communicationName);
        if (communication != null) {
            this.form.get("communication").setValue(communication);
        }
    }

    private resolveControlValue(control: AbstractControl, text: string, pattern: string, type: string): void {
        var regex = new RegExp(pattern);
        const match = text.match(regex);
        if (match != null) {
            var value: string | number = match[1];
            if (type === "number") {
                value = parseInt(match[1], 10) || 0;
            }
            control.setValue(value);
        }
    }

    private evalPreOrder(): void {
        this.preOrderService.getPreOrder(this.preOrderId).subscribe(preOrder => {
            this.form.get("name1").setValue(preOrder.name1);
            this.form.get("name2").setValue(preOrder.name2);
            this.form.get("comment").setValue(preOrder.comment);
            this.form.get("communicationValue").setValue(preOrder.communicationValue);

            const event = this.events.find(e => e.id === preOrder.eventId);
            this.form.get("event").setValue(event);

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
            eventId: this.form.value.event.id,
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
