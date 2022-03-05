import { Communication } from "../../communications/contracts/communication";
import { Menu } from "../../menus/contracts/menu";
import { Order } from "../../orders/contracts/order";
import { PreOrder } from "../../pre-orders/contracts/pre-order";
import { Event } from "../../events/contracts/event";

export class Backup
{
    events: Event[];
    communications: Communication[];
    menus: Menu[];
    orders: Order[];
    preOrders: PreOrder[];
}
