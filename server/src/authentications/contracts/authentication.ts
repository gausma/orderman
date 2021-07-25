import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { AuthenticationCredentials } from "./authentication-credentials";

export type AuthenticationDocument = Authentication & Document;

@Schema()
export class Authentication {
    @Prop()
    id: string;

    @Prop()
    user: string;

    @Prop()
    password: string;

    @Prop()
    credentials: AuthenticationCredentials;
}

export const AuthenticationSchema = SchemaFactory.createForClass(Authentication);
