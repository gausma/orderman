import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, from } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class OrdersService {
    private url = "";

    constructor(private http: HttpClient) {
        const hostname = window.location.hostname;
        this.url = `http://${hostname}:1956/orders`;
    }

    getOrders(): Observable<any> {
        return this.http.get(this.url);
    }

    getOrder(orderId: string): Observable<any> {
        return this.http.get(`${this.url}/${orderId}`);
    }

    createOrder(value): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        return this.http.post(this.url, value, headers);
    }

    updateOrder(id: string, value): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            })
        };
        value.id = id;
        return this.http.put(`${this.url}/${id}`, value, headers);
    }

    deleteOrder(orderId: string): Observable<any> {
        return this.http.delete(`${this.url}/${orderId}`);
    }
}
