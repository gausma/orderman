import { Controller, Get, Post, Body, UsePipes, Param, Put, Delete, UnauthorizedException } from "@nestjs/common";
import { AuthenticationsService } from "./authentications.service";
import { Authentication } from "./contracts/authentication";
import { JoiValidationPipe } from "src/validation/joi-validation.pipe";
import { authenticationValidationSchema } from "./contracts/authentication.schema";
import { Login } from "./contracts/login";
import { loginValidationSchema } from "./contracts/login.schema";
import * as _ from "lodash";

@Controller("authentications")
export class AuthenticationsController {
    constructor(private authenticationsService: AuthenticationsService) {}

    @Get()
    async getAll(): Promise<Authentication[]> {
        console.log(`Get all Authentications`);
        return this.authenticationsService.getAll();
    }

    @Get(":id")
    async getById(@Param("id") id: string): Promise<Authentication> {
        console.log(`Get AuthenticationById: ${id}`);
        return this.authenticationsService.getById(id);
    }    

    @Post()
    @UsePipes(new JoiValidationPipe(authenticationValidationSchema))
    async create(@Body() authentication: Authentication): Promise<Authentication> {
        console.log(`Create Authentication`);
        return this.authenticationsService.create(authentication);
    }

    @Post("login")
//    @UsePipes(new JoiValidationPipe(loginValidationSchema))
    async login(@Body() login: Login): Promise<Authentication> {
        console.log(`Login ${login.user}`);
        const authenticationDocument = await this.authenticationsService.login(login);

        if (_.isNil(authenticationDocument)) {
            throw new UnauthorizedException();
        }
        return authenticationDocument;
    }

    @Put(":id")
    async update(@Param("id") id: string, 
            @Body(new JoiValidationPipe(authenticationValidationSchema)) authentication: Authentication): Promise<Authentication> {
        console.log(`Update Authentication: ${authentication.id}`);
        return this.authenticationsService.update(id, authentication);
    }

    @Delete(":id")
    async delete(@Param("id") id: string): Promise<void> {
        console.log(`Delete Authentications: ${id}`);
        return this.authenticationsService.delete(id);
    } 
}
