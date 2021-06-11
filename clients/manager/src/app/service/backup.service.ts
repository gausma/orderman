import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BackupService {
    private url = '';

    constructor(private http: HttpClient) {
        const hostname = window.location.hostname;
        this.url = `http://${hostname}:1956/backups`;
    }

    createBackup(): Observable<any> {
        return this.http.get(this.url);
    }

    restorBackup(value: any): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.post(this.url, value, headers);
    }
}
