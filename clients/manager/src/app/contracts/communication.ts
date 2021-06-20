export enum CommunicationType {
    None = "none",
    Text = "text",
    Check = "check",
    Email = "email",
    Phone = "phone",
}

export class Communication {
    id?: string;
    name: string;
    communicationType: CommunicationType;
}
