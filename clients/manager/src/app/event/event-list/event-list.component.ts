import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Renderer2 } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs";

import { ColumnDefinition } from "../../contracts/column-definition";
import { EventsService } from "../../services/events.service";
import { Event } from "../../contracts/event";
import { EventRow } from "../../contracts/event-row";
import { AuthenticationsService } from '../../services/authentications.service';
import { AuthenticationCredentials } from '../../contracts/authentication-credentials';

@Component({
    selector: "app-event-list",
    templateUrl: "./event-list.component.html",
    styleUrls: ["./event-list.component.scss"]
})
export class EventListComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatSort) sort: MatSort;

    events: Event[] = [];

    eventTypes: { id: string, title: string }[] = [
        { id: "event", title: "Event" },
        { id: "subEvent", title: "SubEvent" },
    ];

    columns: ColumnDefinition[] = [
        { id: "name", title: $localize`Name`, align: "left", type: "string" },
        { id: "eventTypeTitle", title: $localize`Typ`, align: "left", type: "string" },
    ];
    displayedColumns: string[] = ["name", "eventTypeTitle"];

    dataSource: MatTableDataSource<EventRow> = new MatTableDataSource<EventRow>([]);
    selection = new SelectionModel<EventRow>(false, []);

    showForm = false;
    form: FormGroup;

    command: string;
    eventId: string;

    public credentials: AuthenticationCredentials;
    private authenticationSubscription: Subscription;

    constructor(
        private authenticationsService: AuthenticationsService,
        private formBuilder: FormBuilder,
        private eventService: EventsService,
        private renderer: Renderer2) { }

    ngOnInit(): void {
        this.authenticationSubscription = this.authenticationsService.authentications$.subscribe(a => this.credentials = a.credentials);
        this.initForm();
        this.getData();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy() {
        this.authenticationSubscription.unsubscribe();
    }    

    private initForm(): void {
        this.form = this.formBuilder.group({
            name: [""],
            eventType: ["text"],
        });
    }

    toggleSelection(event: EventRow): void {
        if (!this.showForm) {
            this.selection.toggle(event);
        }
    }

    doFilter(value: string): void {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    
    refresh() {
        this.selection.clear();
        this.getData();
    }

    add(): void {
        this.command = $localize`Erstellen`;
        this.eventId = null;

        this.form.get("name").setValue("");
        this.form.get("eventType").setValue(this.eventTypes[0]);

        this.selection.clear();
        this.showForm = true;

        setTimeout(() => {
            this.renderer.selectRootElement("#name").focus();
        }, 100);
    }

    edit(): void {
        if (!this.selection.isEmpty()) {
            this.command = $localize`Aktualisieren`;
            this.eventId = this.selection.selected[0].id;

            this.form.get("name").setValue(this.selection.selected[0].name);

            const eventType = this.eventTypes.find(c => c.id === this.selection.selected[0].eventTypeId);
            this.form.get("eventType").setValue(eventType);

            this.showForm = true;

            setTimeout(() => {
                this.renderer.selectRootElement("#name").focus();
            }, 100);
        }
    }

    delete(): void {
        if (this.selection.selected.length > 0) {
            this.eventService.deleteEvent(this.selection.selected[0].id).subscribe(() => {
                this.selection.clear();
                this.getData();
            });
        }
    }

    private getData(): void {
        this.eventService.getEvents().subscribe(events => {
            this.processEvents(events);
        });
    }

    private processEvents(events: Event[]): void {
        const data: EventRow[] = [];
        events.forEach(event => {
            const eventType = this.eventTypes.find(c => c.id === event.eventType);
            const element: EventRow = {
                id: event.id,
                name: event.name,
                eventTypeId: eventType.id,
                eventTypeTitle: eventType.title,
            };
            data.push(element);
        });

        this.dataSource.data = data;
    }

    submit(): void {
        const event: Event = {
            name: this.form.value.name,
            eventType: this.form.value.eventType.id,
        };

        if (this.eventId == null) {
            this.eventService.createEvent(event).subscribe(() => {
                this.getData();
                this.showForm = false;
            });
        } else {
            this.eventService.updateEvent(this.eventId, event).subscribe(() => {
                this.getData();
                this.showForm = false;
            });
        }
    }

    cancel(): void {
        this.showForm = false;
    }
}
