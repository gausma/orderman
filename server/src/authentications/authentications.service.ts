import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Authentication, AuthenticationDocument } from "./contracts/authentication";

import { v4 as uuidV4 } from "uuid";
import { Login } from "./contracts/login";
import * as _ from "lodash";

@Injectable()
export class AuthenticationsService {
    private defaultAuthentication: Authentication = {
        id: "",
        user: "",
        password: "",
        credentials: {
            preOrders: {
                read: true,
                write: true,
                order: true,
            },
            orders: {
                read: true,
                write: true,
            },
            communications: {
                read: true,
                write: true,
            },
            menus: {
                read: true,
                write: true,
            },
            statistics: {
                read: true,
            },
            backups: {
                read: true,
            },
            infos: {
                read: true,
            },
            authentications: {
                read: true,
                write: true,
            }
        }
    };

    constructor(@InjectModel(Authentication.name) private authenticationModel: Model<AuthenticationDocument>) { }

    toAuthentication(authenticationDocument: AuthenticationDocument): Authentication {
        return {
            id: authenticationDocument.id,
            user: authenticationDocument.user,
            password: authenticationDocument.password,
            credentials: authenticationDocument.credentials,
        };
    }

    async getAll(): Promise<Authentication[]> {
        const authenticationDocuments = await this.authenticationModel.find().exec();
        return authenticationDocuments.map((md: AuthenticationDocument) => this.toAuthentication(md));
    }

    async getById(id: string): Promise<Authentication> {
        const authenticationDocument = await this.authenticationModel.findOne({ id: id }).exec();
        return this.toAuthentication(authenticationDocument);
    }

    async login(login: Login): Promise<Authentication> {
        // If there is no authentication (user) created, allow everything
        const authenticationCount = await this.authenticationModel.countDocuments();
        if (authenticationCount === 0) {
            return this.defaultAuthentication;
        }

        // Find the user
        const authenticationDocument = await this.authenticationModel.findOne({ user: login.user, password: login.password }).exec();
        if (_.isNil(authenticationDocument)) {
            return null;
        }
        return authenticationDocument;
    }

    async create(authentication: Authentication): Promise<Authentication> {
        const clonedAuthentication = _.clone(authentication);
        if (_.isNil(clonedAuthentication.id)) {
            clonedAuthentication.id = uuidV4();
        }
        const newAuthentication = new this.authenticationModel(clonedAuthentication);
        const authenticationDocument = await newAuthentication.save();
        return this.toAuthentication(authenticationDocument);
    }

    async update(id: string, authentication: Authentication): Promise<Authentication> {
        const authenticationDocument = await this.authenticationModel.updateOne({ id: id }, authentication).exec();
        return this.toAuthentication(authenticationDocument);
    }

    async delete(id: string): Promise<void> {
        await this.authenticationModel.deleteOne({ id: id });
    }

    async deleteAll(): Promise<void> {
        await this.authenticationModel.deleteMany(() => true);
    }
}
