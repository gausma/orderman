import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenusService {
    private url = '';

    constructor(private http: HttpClient) {
        const hostname = window.location.hostname;
        this.url = `http://${hostname}:1956/menus`;
    }

    getMenus(): Observable<any> {
        console.log('Request is sent!');
        return this.http.get(this.url);
    }

    createMenu(value): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(this.url, value, headers);
    }

    updateMenu(id: string, value): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        value.id = id;
        return this.http.put(`${this.url}/${id}`, value, headers);
    }

    deleteMenu(id: string): Observable<any> {
        return this.http.delete(`${this.url}/${id}`);
    }
}
