import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { LoginService } from 'src/app/service/login.service';
import { Credentials } from 'src/app/contracts/credentials';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidenav-list',
    templateUrl: './sidenav-list.component.html',
    styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {
    @Output() sidenavClose = new EventEmitter();

    public credentials: Credentials;
    private subscription: Subscription;

    constructor(private loginService: LoginService) { }

    ngOnInit(): void {
        this.subscription = this.loginService.credentials$.
            subscribe(credentials => this.credentials = credentials);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    public onSidenavClose = () => {
        this.sidenavClose.emit();
    }
}
