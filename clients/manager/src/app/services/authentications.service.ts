import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Login } from "../contracts/login";
import { Observable, BehaviorSubject, pipe, of } from "rxjs";
import { Authentication } from '../contracts/authentication';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: "root"
})
export class AuthenticationsService {
    private url = "";

    private defaultAuthentication: Authentication = {
        id: "",
        user: "",
        password: "",
        credentials: {
            preOrders: {
                read: false,
                write: false,
                order: false,
            },
            orders: {
                read: false,
                write: false,
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
                read: false,
            },
            backups: {
                read: false,
            },
            infos: {
                read: true,
            },
            authentications: {
                read: false,
                write: false,
            }
        }
    }

    private authenticationsSource = new BehaviorSubject<Authentication>(this.defaultAuthentication);
    public authentications$ = this.authenticationsSource.asObservable();

    constructor(private http: HttpClient) {
        const hostname = window.location.hostname;
        this.url = `http://${hostname}:1956/authentications`;
    }

    getAuthentications(): Observable<any> {
        return this.http.get(this.url);
    }

    createAuthentication(value): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        return this.http.post(this.url, value, headers);
    }

    updateAuthentication(id: string, value): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        value.id = id;
        return this.http.put(`${this.url}/${id}`, value, headers);
    }

    deleteAuthentication(id: string): Observable<any> {
        return this.http.delete(`${this.url}/${id}`);
    }

    login(login: Login): void {
        const headers = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        this.http.post(`${this.url}/login`, login, headers).pipe(
            catchError(() => of(this.defaultAuthentication))
        ).subscribe((authentication: Authentication) => {
            this.authenticationsSource.next(authentication);
        });
    }
}
