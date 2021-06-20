import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, from } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MenusService {
    private url = "";

    constructor(private http: HttpClient) { 
        const hostname = window.location.hostname;
        this.url = `http://${hostname}:1956/menus`;
    }

    resolveItems(): Observable<any> {
        return this.http.get(this.url);
    }
}
