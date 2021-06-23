import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PreOrderFormComponent } from "./pre-order/pre-order-form/pre-order-form.component";
import { PreOrderListComponent } from "./pre-order/pre-order-list/pre-order-list.component";
import { CommunicationListComponent } from "./communication/communication-list/communication-list.component";
import { MenuListComponent } from "./menu/menu-list/menu-list.component";
import { OrderListComponent } from "./order/order-list/order-list.component";
import { OrderFormComponent } from "./order/order-form/order-form.component";
import { StatisticComponent } from "./statistic/statistic.component";
import { BackupComponent } from "./backup/backup.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { RouteAccessGuard } from './auth/route-access/route-access.guard';

const routes: Routes = [
    { path: "welcome", component: WelcomeComponent, data: { credentials: "welcome", function: "read" } },
    { path: "preorderlist", component: PreOrderListComponent, data: { credentials: "preOrders", function: "read" }, canActivate: [RouteAccessGuard] },
    { path: "preorderform", component: PreOrderFormComponent, data: { credentials: "preOrders", function: "write" }, canActivate: [RouteAccessGuard]  },
    { path: "orderlist", component: OrderListComponent, data: { credentials: "orders", function: "read" }, canActivate: [RouteAccessGuard] },
    { path: "orderform", component: OrderFormComponent, data: { credentials: "orders", function: "write" }, canActivate: [RouteAccessGuard] },
    { path: "communicationlist", component: CommunicationListComponent, data: { credentials: "communications", function: "read" }, canActivate: [RouteAccessGuard]  },
    { path: "menulist", component: MenuListComponent, data: { credentials: "menus", function: "read" }, canActivate: [RouteAccessGuard] },
    { path: "statistic", component: StatisticComponent, data: { credentials: "statistics", function: "read" }, canActivate: [RouteAccessGuard] },
    { path: "backup", component: BackupComponent, data: { credentials: "backups", function: "read" }, canActivate: [RouteAccessGuard] },
    { path: "**", component: WelcomeComponent, data: { credentials: "welcome", function: "read" } },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
