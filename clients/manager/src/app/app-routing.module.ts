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

const routes: Routes = [
    { path: "welcome", component: WelcomeComponent, data: { credentials: "welcome" }  },
    { path: "preorderlist", component: PreOrderListComponent, data: { credentials: "preOrders" } },
    { path: "preorderform", component: PreOrderFormComponent, data: { credentials: "preOrders" }  },
    { path: "orderlist", component: OrderListComponent, data: { credentials: "orders" } },
    { path: "orderform", component: OrderFormComponent, data: { credentials: "orders" } },
    { path: "communicationlist", component: CommunicationListComponent, data: { credentials: "communications" }  },
    { path: "menulist", component: MenuListComponent, data: { credentials: "menus" }  },
    { path: "statistic", component: StatisticComponent, data: { credentials: "statistics" }  },
    { path: "backup", component: BackupComponent, data: { credentials: "backups" }  },
    { path: "**", component: WelcomeComponent, data: { credentials: "welcome" }  },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
