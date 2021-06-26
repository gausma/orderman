import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Renderer2 } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs";

import { ColumnDefinition } from "../../contracts/column-definition";
import { CommunicationsService } from "../../service/communications.service";
import { Communication } from "../../contracts/communication";
import { CommunicationRow } from "../../contracts/communication-row";
import { LoginService } from "../../service/login.service";
import { Credentials } from "../../contracts/credentials";

@Component({
    selector: "app-communication-list",
    templateUrl: "./communication-list.component.html",
    styleUrls: ["./communication-list.component.scss"]
})
export class CommunicationListComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatSort) sort: MatSort;

    communications: Communication[] = [];

    communicationTypes: { id: string, title: string }[] = [
        { id: "text", title: "Text" },
        { id: "check", title: "Checkbox" },
        { id: "email", title: "Email Adresse" },
        { id: "phone", title: "Telefonnummer" },
    ];

    columns: ColumnDefinition[] = [
        { id: "name", title: "Name", align: "left", type: "string" },
        { id: "communicationTypeTitle", title: "Typ", align: "left", type: "string" },
    ];
    displayedColumns: string[] = ["name", "communicationTypeTitle"];

    dataSource: MatTableDataSource<CommunicationRow> = new MatTableDataSource<CommunicationRow>([]);
    selection = new SelectionModel<CommunicationRow>(false, []);

    showForm = false;
    form: FormGroup;

    command: string;
    communicationId: string;

    public credentials: Credentials;
    private credentialSubscription: Subscription;

    constructor(
        private loginService: LoginService,
        private formBuilder: FormBuilder,
        private communicationService: CommunicationsService,
        private renderer: Renderer2) { }

    ngOnInit(): void {
        this.credentialSubscription = this.loginService.credentials$.subscribe(c => this.credentials = c);
        this.initForm();
        this.getData();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy() {
        this.credentialSubscription.unsubscribe();
    }    

    private initForm(): void {
        this.form = this.formBuilder.group({
            name: [""],
            communicationType: ["text"],
        });
    }

    toggleSelection(communication: CommunicationRow): void {
        if (!this.showForm) {
            this.selection.toggle(communication);
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
        this.command = "Erstellen";
        this.communicationId = null;

        this.form.get("name").setValue("");
        this.form.get("communicationType").setValue(this.communicationTypes[0]);

        this.selection.clear();
        this.showForm = true;

        setTimeout(() => {
            this.renderer.selectRootElement("#name").focus();
        }, 100);
    }

    edit(): void {
        if (!this.selection.isEmpty()) {
            this.command = "Aktualisieren";
            this.communicationId = this.selection.selected[0].id;

            this.form.get("name").setValue(this.selection.selected[0].name);

            const communicationType = this.communicationTypes.find(c => c.id === this.selection.selected[0].communicationTypeId);
            this.form.get("communicationType").setValue(communicationType);

            this.showForm = true;

            setTimeout(() => {
                this.renderer.selectRootElement("#name").focus();
            }, 100);
        }
    }

    delete(): void {
        if (this.selection.selected.length > 0) {
            this.communicationService.deleteCommunication(this.selection.selected[0].id).subscribe(() => {
                this.selection.clear();
                this.getData();
            });
        }
    }

    private getData(): void {
        this.communicationService.getCommunications().subscribe(communications => {
            this.processCommunications(communications);
        });
    }

    private processCommunications(communications: Communication[]): void {
        const data: CommunicationRow[] = [];
        communications.forEach(communication => {
            const communicationType = this.communicationTypes.find(c => c.id === communication.communicationType);
            const element: CommunicationRow = {
                id: communication.id,
                name: communication.name,
                communicationTypeId: communicationType.id,
                communicationTypeTitle: communicationType.title,
            };
            data.push(element);
        });

        this.dataSource.data = data;
    }

    submit(): void {
        const communication: Communication = {
            name: this.form.value.name,
            communicationType: this.form.value.communicationType.id,
        };

        if (this.communicationId == null) {
            this.communicationService.createCommunication(communication).subscribe(() => {
                this.getData();
                this.showForm = false;
            });
        } else {
            this.communicationService.updateCommunication(this.communicationId, communication).subscribe(() => {
                this.getData();
                this.showForm = false;
            });
        }
    }

    cancel(): void {
        this.showForm = false;
    }
}
