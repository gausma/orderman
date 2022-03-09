import { OrderPosition } from "./order-position";

export class Order {
    id?: string;
    name1: string;
    name2: string;
    comment: string;
    eventId: string;
    datetime: string;
    preOrderId: string;
    positions: OrderPosition[];
}
