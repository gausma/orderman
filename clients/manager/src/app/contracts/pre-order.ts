import { PreOrderPosition } from "./pre-order-position";

export class PreOrder {
    id?: string;
    datetime: string;
    name1: string;
    name2: string;
    comment: string;
    eventId: string;
    communicationId: string;
    communicationValue: string;
    positions: PreOrderPosition[];
}
