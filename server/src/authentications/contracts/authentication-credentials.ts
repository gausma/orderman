import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AuthenticationCredentialsDocument = AuthenticationCredentials & Document;

@Schema()
export class AuthenticationCredentialsRWO {
    @Prop()
    read: boolean;

    @Prop()
    write: boolean;

    @Prop()
    order: boolean;
}

@Schema()
export class AuthenticationCredentialsRW {
    @Prop()
    read: boolean;

    @Prop()
    write: boolean;
}

@Schema()
export class AuthenticationCredentialsR {
    @Prop()
    read: boolean;
}

@Schema()
export class AuthenticationCredentials {
    @Prop()
    preOrders: AuthenticationCredentialsRWO;

    @Prop()
    orders: AuthenticationCredentialsRW;

    @Prop()
    communications: AuthenticationCredentialsRW;

    @Prop()
    menus: AuthenticationCredentialsRW;

    @Prop()
    statistics: AuthenticationCredentialsR;

    @Prop()
    backups: AuthenticationCredentialsR;

    @Prop()
    infos: AuthenticationCredentialsR;

    @Prop()
    authentications: AuthenticationCredentialsRW;
}

export const AuthenticationCredentialsSchema = SchemaFactory.createForClass(AuthenticationCredentials);
