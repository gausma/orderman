import { Injectable } from "@angular/core";
// import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, from, of, BehaviorSubject } from "rxjs";
import { Login } from "../contracts/login";
import { Credentials } from "../contracts/credentials";

@Injectable({
    providedIn: "root"
})
export class LoginService {
    // private url = "";

    // constructor(private http: HttpClient) {
    //     const hostname = window.location.hostname;
    //     this.url = `http://${hostname}:1956/logins`;
    // }

    private default: Credentials = {
        preOrders: {
            read: true,
            write: false,
            order: false,
        },
        orders: {
            read: true,
            write: true,
        },
        communications: {
            read: false,
            write: false,
        },
        menus: {
            read: false,
            write: false,
        },
        statistics: {
            read: true,
        },
        backups: {
            read: false,
        },
    }

    private credentialsSource = new BehaviorSubject<Credentials>(this.default);

    public credentials$ = this.credentialsSource.asObservable();

    login(login: Login): {user: string, credentials: Credentials} {
        let user: string = "";
        let credentials: Credentials = this.default;
        if (login.user === "MVE" && login.password === "MVE") {
            user = login.user;
            credentials = {
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
            };
        }

        this.credentialsSource.next(credentials);
        return {user, credentials};
    }
}
