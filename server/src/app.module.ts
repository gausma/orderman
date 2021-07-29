import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MenusModule } from "./menus/menus.module";
import { OrdersModule } from "./orders/orders.module";
import { PreOrdersModule } from "./pre-orders/pre-orders.module";
import { CommunicationsModule } from "./communications/communications.module";
import { BackupsModule } from "./backups/backups.module";
import { AuthenticationsModule } from "./authentications/authentications.module";

import { join } from "path";

// Open clients by http://<ip>:1956/index.html

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "../../clients/order/dist/order/"),
            serveRoot: "/order",
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "../../clients/manager/dist/manager/"),
            serveRoot: "/manager",
        }),
        MongooseModule.forRoot("mongodb://localhost/orderman"),
        BackupsModule,
        CommunicationsModule,
        MenusModule,
        OrdersModule,
        PreOrdersModule,
        AuthenticationsModule
    ],
    controllers: [
        AppController
    ],
    providers: [
        AppService
    ],
})
export class AppModule { }
