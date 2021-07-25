
export class AuthenticationRow {
    id?: string;
    user: string;
    password: string;
    preOrdersRead: boolean;
    preOrdersWrite: boolean;
    preOrdersOrder: boolean;
    ordersRead: boolean;
    ordersWrite: boolean;
    communicationsRead: boolean;
    communicationsWrite: boolean;
    menusRead: boolean;
    menusWrite: boolean;
    statisticsRead: boolean;
    backupsRead: boolean;
    infosRead: boolean;
    authenticationsRead: boolean;
    authenticationsWrite: boolean;
}
