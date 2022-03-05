
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Renderer2 } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs";

import { ColumnDefinition } from "../../contracts/column-definition";
import { AuthenticationsService } from "../../services/authentications.service";
import { Authentication } from "../../contracts/authentication";
import { AuthenticationRow } from "../../contracts/authentication-row";
import { AuthenticationCredentials } from '../../contracts/authentication-credentials';

@Component({
    selector: "app-authentication-list",
    templateUrl: "./authentication-list.component.html",
    styleUrls: ["./authentication-list.component.scss"]
})
export class AuthenticationListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatSort) sort: MatSort;

    authentications: Authentication[] = [];

    columns: ColumnDefinition[] = [
        { id: "user", title: $localize`Benutzer`, align: "left", type: "string" },
        { id: "preOrdersRead", title: $localize`Vorbestellung lesen`, align: "center", type: "bool" },
        { id: "preOrdersWrite", title: $localize`Vorbestellung schreiben`, align: "center", type: "bool" },
        { id: "preOrdersOrder", title: $localize`Vorbestellung übernehmen`, align: "center", type: "bool" },
        { id: "ordersRead", title: $localize`Bestellung lesen`, align: "center", type: "bool" },
        { id: "ordersWrite", title: $localize`Bestellung schreiben`, align: "center", type: "bool" },
        { id: "eventsRead", title: $localize`Veranstaltung lesen`, align: "center", type: "bool" },
        { id: "eventsWrite", title: $localize`Veranstaltung schreiben`, align: "center", type: "bool" },
        { id: "communicationsRead", title: $localize`Kommunikation lesen`, align: "center", type: "bool" },
        { id: "communicationsWrite", title: $localize`Kommunikation schreiben`, align: "center", type: "bool" },
        { id: "menusRead", title: $localize`Gerichte lesen`, align: "center", type: "bool" },
        { id: "menusWrite", title: $localize`Gerichte schreiben`, align: "center", type: "bool" },
        { id: "statisticsRead", title: $localize`Statistik lesen`, align: "center", type: "bool" },
        { id: "backupsRead", title: $localize`Backup lesen`, align: "center", type: "bool" },
        { id: "infosRead", title: $localize`Info lesen`, align: "center", type: "bool" },
        { id: "authenticationsRead", title: $localize`Berechtigung lesen`, align: "center", type: "bool" },
        { id: "authenticationsWrite", title: $localize`Berechtigung schreiben`, align: "center", type: "bool" },
    ];
    displayedColumns: string[] = [
        "user", 
        "preOrdersRead", "preOrdersWrite", "preOrdersOrder",
        "ordersRead", "ordersWrite",
        "eventsRead", "eventsWrite",
        "communicationsRead", "communicationsWrite",
        "menusRead", "menusWrite",
        "statisticsRead", "backupsRead", "infosRead",
        "authenticationsRead", "authenticationsWrite"];

    dataSource: MatTableDataSource<AuthenticationRow> = new MatTableDataSource<AuthenticationRow>([]);
    selection = new SelectionModel<AuthenticationRow>(false, []);

    showForm = false;
    form: FormGroup;

    command: string;
    authenticationId: string;

    public credentials: AuthenticationCredentials;
    private authenticationSubscription: Subscription;

    constructor(
        private authenticationsService: AuthenticationsService,
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationsService,
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
            user: [""],
            password: [""],
            preOrdersRead: [false],
            preOrdersWrite: [false],
            preOrdersOrder: [false],
            ordersRead: [false],
            ordersWrite: [false],
            eventsRead: [false],
            eventsWrite: [false],
            communicationsRead: [false],
            communicationsWrite: [false],
            menusRead: [false],
            menusWrite: [false],
            statisticsRead: [false],
            backupsRead: [false],
            infosRead: [false],
            authenticationsRead: [false],
            authenticationsWrite: [false],
        });
    }

    toggleSelection(authentication: AuthenticationRow): void {
        if (!this.showForm) {
            this.selection.toggle(authentication);
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
        this.authenticationId = null;

        this.form.get("user").setValue("");
        this.form.get("password").setValue("");
        this.form.get("preOrdersRead").setValue(false);
        this.form.get("preOrdersRead").setValue(false);
        this.form.get("preOrdersRead").setValue(false);
        this.form.get("ordersRead").setValue(false);
        this.form.get("ordersRead").setValue(false);
        this.form.get("eventsRead").setValue(false);
        this.form.get("eventsWrite").setValue(false);
        this.form.get("communicationsRead").setValue(false);
        this.form.get("communicationsWrite").setValue(false);
        this.form.get("menusRead").setValue(false);
        this.form.get("menusWrite").setValue(false);
        this.form.get("statisticsRead").setValue(false);
        this.form.get("backupsRead").setValue(false);
        this.form.get("infosRead").setValue(false);
        this.form.get("authenticationsRead").setValue(false);
        this.form.get("authenticationsWrite").setValue(false);
        this.selection.clear();
        this.showForm = true;

        setTimeout(() => {
            this.renderer.selectRootElement("#user").focus();
        }, 100);
    }

    edit(): void {
        if (!this.selection.isEmpty()) {
            this.command = $localize`Aktualisieren`;
            this.authenticationId = this.selection.selected[0].id;

            this.form.get("user").setValue(this.selection.selected[0].user);
            this.form.get("password").setValue(this.selection.selected[0].password);
            this.form.get("preOrdersRead").setValue(this.selection.selected[0].preOrdersRead);
            this.form.get("preOrdersWrite").setValue(this.selection.selected[0].preOrdersWrite);
            this.form.get("preOrdersOrder").setValue(this.selection.selected[0].preOrdersOrder);
            this.form.get("ordersRead").setValue(this.selection.selected[0].ordersRead);
            this.form.get("ordersWrite").setValue(this.selection.selected[0].ordersWrite);
            this.form.get("eventsRead").setValue(this.selection.selected[0].eventsRead);
            this.form.get("eventsWrite").setValue(this.selection.selected[0].eventsWrite);
            this.form.get("communicationsRead").setValue(this.selection.selected[0].communicationsRead);
            this.form.get("communicationsWrite").setValue(this.selection.selected[0].communicationsWrite);
            this.form.get("menusRead").setValue(this.selection.selected[0].menusRead);
            this.form.get("menusWrite").setValue(this.selection.selected[0].menusWrite);
            this.form.get("statisticsRead").setValue(this.selection.selected[0].statisticsRead);
            this.form.get("backupsRead").setValue(this.selection.selected[0].backupsRead);
            this.form.get("infosRead").setValue(this.selection.selected[0].infosRead);
            this.form.get("authenticationsRead").setValue(this.selection.selected[0].authenticationsRead);
            this.form.get("authenticationsWrite").setValue(this.selection.selected[0].authenticationsWrite);

            this.showForm = true;

            setTimeout(() => {
                this.renderer.selectRootElement("#user").focus();
            }, 100);
        }
    }

    delete(): void {
        if (this.selection.selected.length > 0) {
            this.authenticationService.deleteAuthentication(this.selection.selected[0].id).subscribe(() => {
                this.selection.clear();
                this.getData();
            });
        }
    }

    private getData(): void {
        this.authenticationService.getAuthentications().subscribe(authentications => {
            this.processAuthentications(authentications);
        });
    }

    private processAuthentications(authentications: Authentication[]): void {
        const data: AuthenticationRow[] = [];
        authentications.forEach(authentication => {
            const element: AuthenticationRow = {
                id: authentication.id,
                user: authentication.user,
                password: authentication.password,
                preOrdersRead: authentication.credentials.preOrders.read,
                preOrdersWrite: authentication.credentials.preOrders.write,
                preOrdersOrder: authentication.credentials.preOrders.order,
                ordersRead: authentication.credentials.orders.read,
                ordersWrite: authentication.credentials.orders.write,
                eventsRead: authentication.credentials.events.read,
                eventsWrite: authentication.credentials.events.write,
                communicationsRead: authentication.credentials.communications.read,
                communicationsWrite: authentication.credentials.communications.write,
                menusRead: authentication.credentials.menus.read,
                menusWrite: authentication.credentials.menus.write,
                statisticsRead: authentication.credentials.statistics.read,
                backupsRead: authentication.credentials.backups.read,
                infosRead: authentication.credentials.infos.read,
                authenticationsRead: authentication.credentials.authentications.read,
                authenticationsWrite: authentication.credentials.authentications.write,
            };
            data.push(element);
        });

        this.dataSource.data = data;
    }

    submit(): void {
        const authentication: Authentication = {
            user: this.form.value.user,
            password: this.form.value.password,
            credentials: {
                preOrders: {
                    read: this.form.value.preOrdersRead,
                    write: this.form.value.preOrdersWrite,
                    order: this.form.value.preOrdersOrder,
                },
                orders: {
                    read: this.form.value.ordersRead,
                    write: this.form.value.ordersWrite,
                },
                events: {
                    read: this.form.value.eventsRead,
                    write: this.form.value.eventsWrite,
                },
                communications: {
                    read: this.form.value.communicationsRead,
                    write: this.form.value.communicationsWrite,
                },
                menus: {
                    read: this.form.value.menusRead,
                    write: this.form.value.menusWrite,
                },
                statistics: {
                    read: this.form.value.statisticsRead,
                },
                backups: {
                    read: this.form.value.backupsRead,
                },
                infos: {
                    read: this.form.value.infosRead,
                },
                authentications: {
                    read: this.form.value.authenticationsRead,
                    write: this.form.value.authenticationsWrite,
                }
            },
        };

        if (this.authenticationId == null) {
            this.authenticationService.createAuthentication(authentication).subscribe(() => {
                this.getData();
                this.showForm = false;
            });
        } else {
            this.authenticationService.updateAuthentication(this.authenticationId, authentication).subscribe(() => {
                this.getData();
                this.showForm = false;
            });
        }
    }

    cancel(): void {
        this.showForm = false;
    }
}
