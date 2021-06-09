import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommunicationsService {
    private url = '';

    constructor(private http: HttpClient) {
        const hostname = window.location.hostname;
        this.url = `http://${hostname}:1956/communications`;
    }

    getCommunications(): Observable<any> {
        return this.http.get(this.url);
    }

    createCommunication(value): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(this.url, value, headers);
    }

    updateCommunication(id: string, value): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        value.id = id;
        return this.http.put(`${this.url}/${id}`, value, headers);
    }

    deleteCommunication(id: string): Observable<any> {
        return this.http.delete(`${this.url}/${id}`);
    }
}
