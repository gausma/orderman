import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreOrderFormComponent } from './pre-order/pre-order-form/pre-order-form.component';
import { PreOrderListComponent } from './pre-order/pre-order-list/pre-order-list.component';
import { CommunicationListComponent } from './communication/communication-list/communication-list.component';
import { MenuListComponent } from './menu/menu-list/menu-list.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderFormComponent } from './order/order-form/order-form.component';
import { StatisticComponent } from './statistic/statistic/statistic.component';

const routes: Routes = [
    { path: 'preorderlist', component: PreOrderListComponent },
    { path: 'preorderform', component: PreOrderFormComponent },
    { path: 'orderlist', component: OrderListComponent },
    { path: 'orderform', component: OrderFormComponent },
    { path: 'communicationlist', component: CommunicationListComponent },
    { path: 'menulist', component: MenuListComponent },
    { path: 'statistic', component: StatisticComponent },
    { path: '**', component: PreOrderListComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
