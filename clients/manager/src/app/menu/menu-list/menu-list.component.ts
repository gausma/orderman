
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ColumnDefinition } from '../../contracts/column-definition';
import { MenusService } from '../../service/menus.service';
import { Menu } from '../../contracts/menu';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MenuRow } from 'src/app/contracts/menu-row';

@Component({
    selector: 'app-menu-list',
    templateUrl: './menu-list.component.html',
    styleUrls: ['./menu-list.component.scss']
  })
export class MenuListComponent implements OnInit, AfterViewInit {

    @ViewChild(MatSort) sort: MatSort;

    menus: Menu[] = [];

    columns: ColumnDefinition[] = [
        { id: 'name', title: 'Name', align: 'left', type: 'string' },
        { id: 'price', title: 'Preis €', align: 'left', type: 'currency' },
        { id: 'comment', title: 'Bemerkung', align: 'left', type: 'string' },
    ];
    displayedColumns: string[] = ['name', 'price', 'comment'];

    dataSource: MatTableDataSource<MenuRow> = new MatTableDataSource<MenuRow>([]);
    selection = new SelectionModel<MenuRow>(false, []);

    showForm = false;
    form: FormGroup;

    command: string;
    menuId: string;

    constructor(private formBuilder: FormBuilder,
                private menuService: MenusService) { }

    ngOnInit(): void {
        this.initForm();

        this.getData();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            name: [''],
            price: [0],
            comment: [''],
        });
    }

    toggleSelection(menu: MenuRow): void {
        if (!this.showForm) {
            this.selection.toggle(menu);
        }
    }

    doFilter(value: string): void {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }

    add(): void {
        this.command = 'Erstellen';
        this.menuId = null;

        this.form.get('name').setValue('');
        this.form.get('price').setValue(0);
        this.form.get('comment').setValue('');

        this.selection.clear();
        this.showForm = true;
    }

    edit(): void {
        if (!this.selection.isEmpty()) {
            this.command = 'Aktualisieren';
            this.menuId = this.selection.selected[0].id;

            this.form.get('name').setValue(this.selection.selected[0].name);
            this.form.get('price').setValue(this.selection.selected[0].price);
            this.form.get('comment').setValue(this.selection.selected[0].comment);

            this.showForm = true;
        }
    }

    delete(): void {
        if (this.selection.selected.length > 0) {
            this.menuService.deleteMenu(this.selection.selected[0].id).subscribe(() => {
                this.selection.clear();
                this.getData();
            });
        }
    }

    private getData(): void {
        this.menuService.getMenus().subscribe(menus => {
            this.processMenus(menus);
        });
    }

    private processMenus(menus: Menu[]): void {
        const data: MenuRow[] = [];
        menus.forEach(menu => {
            const element: MenuRow = {
                id: menu.id,
                name: menu.name,
                price: menu.price,
                comment: menu.comment,
            };
            data.push(element);
        });

        this.dataSource.data = data;
    }

    submit(): void {
        const menu: Menu = {
            name: this.form.value.name,
            price: this.form.value.price,
            comment: this.form.value.comment,
        };

        if (this.menuId == null) {
            this.menuService.createMenu(menu).subscribe(() => {
                this.getData();
                this.showForm = false;
            });
        } else {
            this.menuService.updateMenu(this.menuId, menu).subscribe(() => {
                this.getData();
                this.showForm = false;
            });
        }
    }

    cancel(): void {
        this.showForm = false;
    }
}
