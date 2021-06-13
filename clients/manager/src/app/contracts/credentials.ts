export class Credentials {
    preOrders: {
        read: boolean,
        write: boolean,
        order: boolean,
    };
    orders: {
        read: boolean,
        write: boolean,
    };
    communications: {
        read: boolean,
        write: boolean,
    };
    menus: {
        read: boolean,
        write: boolean,
    };
    statistics: {
        read: boolean,
    };
    backups: {
        read: boolean,
    };    
}
