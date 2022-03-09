import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class EventsService {
    private url = "";

    constructor(private http: HttpClient) { 
        const hostname = window.location.hostname;
        this.url = `http://${hostname}:1956/events`;
    }

    resolveItems(): Observable<any> {
        return this.http.get(this.url);
    }
}
