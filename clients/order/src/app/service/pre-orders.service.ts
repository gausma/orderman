import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, from } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class PreOrdersService {
    private url = "";

    constructor(private http: HttpClient) {
        const hostname = window.location.hostname;
        this.url = `http://${hostname}:1956/preorders`;
    }

    getPreOrders(): Observable<any> {
        return this.http.get(this.url);
    }

    getPreOrder(preOrderId: string): Observable<any> {
        return this.http.get(`${this.url}/${preOrderId}`);
    }

    getPreOrdersByName(name: string): Observable<any> {
        return this.http.get(`${this.url}?name=${name}`);
    }

    getWithoutOrderByName(name: string): Observable<any> {
        return this.http.get(`${this.url}?name=${name}&order=true`);
    }

    createPreOrder(value): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        return this.http.post(this.url, value, headers);
    }

    updatePreOrder(id: string, value): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        value.id = id;
        return this.http.put(`${this.url}/${id}`, value, headers);
    }

    deletePreOrder(preOrderId: string): Observable<any> {
        return this.http.delete(`${this.url}/${preOrderId}`);
    }
}
