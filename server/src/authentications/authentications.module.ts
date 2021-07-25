import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthenticationsController } from "./authentications.controller";
import { AuthenticationsService } from "./authentications.service";
import { Authentication, AuthenticationSchema } from "../authentications/contracts/authentication";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Authentication.name, schema: AuthenticationSchema }]),
    ],        
    controllers: [AuthenticationsController],
    providers: [AuthenticationsService],
})
export class AuthenticationsModule {}
