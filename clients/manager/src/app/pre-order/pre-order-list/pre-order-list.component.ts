import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { PreOrdersService } from '../../service/pre-orders.service';
import { PreOrder } from '../../contracts/pre-order';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MenusService } from '../../service/menus.service';
import { forkJoin } from 'rxjs';
import { Menu } from '../../contracts/menu';
import { ColumnDefinition } from '../../contracts/column-definition';
import { CommunicationsService } from '../../service/communications.service';
import { Communication } from '../../contracts/communication';
import { PreOrderRow } from 'src/app/contracts/pre-order-row';

@Component({
    selector: 'app-pre-order-list',
    templateUrl: './pre-order-list.component.html',
    styleUrls: ['./pre-order-list.component.scss']
})
export class PreOrderListComponent implements OnInit, AfterViewInit {

    @ViewChild(MatSort) sort: MatSort;

    predefinedColumns: ColumnDefinition[] = [
        { id: 'name1', title: 'Name', align: 'left', type: 'string' },
        { id: 'name2', title: 'Vorname', align: 'left', type: 'string' },
        { id: 'comment', title: 'Bemerkung', align: 'left', type: 'string' },
        { id: 'communicationId', title: 'Kommunikation', align: 'left', type: 'string' },
        { id: 'communicationValue', title: 'Info', align: 'left', type: 'string' },
    ];

    communications: Communication[] = [];
    menus: Menu[] = [];

    columns: ColumnDefinition[] = [];
    displayedColumns: string[] = [];

    dataSource: MatTableDataSource<PreOrderRow> = new MatTableDataSource<PreOrderRow>([]);
    selection = new SelectionModel<PreOrderRow>(false, []);

    constructor(
        private communicationService: CommunicationsService,
        private menusService: MenusService,
        private preOrderService: PreOrdersService,
        private router: Router) { }

    ngOnInit(): void {
        this.getData();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    doFilter(value: string): void {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }

    refresh() {
        this.selection.clear();
        this.getData();
    }

    add(): void {
        this.router.navigate(['preorderform']);
    }

    edit(): void {
        if (!this.selection.isEmpty()) {
            this.router.navigate(['preorderform'], { queryParams: { preOrderId: this.selection.selected[0].id } });
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

    private getData(): void {
        forkJoin([
            this.communicationService.getCommunications(),
            this.menusService.getMenus(),
            this.preOrderService.getPreOrders()
        ]).subscribe(responseList => {
            this.processCommunications(responseList[0]);
            this.processMenus(responseList[1]);
            this.processPreOrders(responseList[2]);
        });
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
                type: 'string',
            });
        });

        menus.forEach((menu) => {
            this.columns.push({
                id: menu.id,
                title: menu.name,
                align: 'center',
                type: 'string',
            });
        });

        this.displayedColumns = [];
        this.columns.forEach(column => {
            this.displayedColumns.push(column.id);
        });
    }

    private processPreOrders(preOrders: PreOrder[]): void {
        const data: PreOrderRow[] = [];
        preOrders.forEach(preOrder => {
            const communication = this.communications.find(c => c.id === preOrder.communicationId);

            const element: PreOrderRow = {
                id: preOrder.id,
                name1: preOrder.name1,
                name2: preOrder.name2,
                comment: preOrder.comment,
                communicationId: communication.name,
                communicationValue: preOrder.communicationValue
            };

            this.menus.forEach(menu => {
                const position = preOrder.positions.find(p => p.id === menu.id);
                element[menu.id] = '';
                if (position != null && position.amount !== 0) {
                    element[menu.id] = position.amount;
                }
            });

            data.push(element);
        });

        this.dataSource.data = data;
    }
}
