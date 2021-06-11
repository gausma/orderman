import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PreOrderListComponent } from './pre-order/pre-order-list/pre-order-list.component';
import { PreOrderFormComponent } from './pre-order/pre-order-form/pre-order-form.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderFormComponent } from './order/order-form/order-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { CommunicationListComponent } from './communication/communication-list/communication-list.component';
import { MenuListComponent } from './menu/menu-list/menu-list.component';
import { StatisticComponent } from './statistic/statistic.component';
import { BackupComponent } from './backup/backup.component';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './navigation/header/header.component';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [
        AppComponent,
        PreOrderListComponent,
        PreOrderFormComponent,
        OrderListComponent,
        OrderFormComponent,
        HeaderComponent,
        SidenavListComponent,
        CommunicationListComponent,
        MenuListComponent,
        StatisticComponent,
        BackupComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatSelectModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatCardModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
