import { Component, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthenticationsService } from '../../services/authentications.service';
import { AuthenticationCredentials } from 'src/app/contracts/authentication-credentials';

@Component({
    selector: "app-sidenav-list",
    templateUrl: "./sidenav-list.component.html",
    styleUrls: ["./sidenav-list.component.scss"]
})
export class SidenavListComponent implements OnInit, OnDestroy {
    @Output() sidenavClose = new EventEmitter();

    public credentials: AuthenticationCredentials;
    private authenticationSubscription: Subscription;

    constructor(private authenticationsService: AuthenticationsService) { }

    ngOnInit(): void {
        this.authenticationSubscription = this.authenticationsService.authentications$.subscribe(a => this.credentials = a.credentials);
    }

    ngOnDestroy() {
        this.authenticationSubscription.unsubscribe();
    }

    public onSidenavClose = () => {
        this.sidenavClose.emit();
    }
}
