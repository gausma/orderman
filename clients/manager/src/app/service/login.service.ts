import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { Login } from '../contracts/login';
import { Credentials } from '../contracts/credentials';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    // private url = '';

    // constructor(private http: HttpClient) {
    //     const hostname = window.location.hostname;
    //     this.url = `http://${hostname}:1956/logins`;
    // }

    private default: Credentials = {
        preOrders: false,
        orders: true,
        communications: false,
        menus: false,
        statistics: true,
        backups: false,
    }

    private credentialsSource = new BehaviorSubject<Credentials>(this.default);

    public credentials$ = this.credentialsSource.asObservable();

    login(login: Login): void {
        if (login.user === "MVE" && login.password == "MVE") {
            this.credentialsSource.next({
                preOrders: true,
                orders: true,
                communications: true,
                menus: true,
                statistics: true,
                backups: true,
            });
        } else {
            this.credentialsSource.next(this.default);    
        }
    }
}
