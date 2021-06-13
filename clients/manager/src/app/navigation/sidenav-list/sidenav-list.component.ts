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
    private credentialSubscription: Subscription;

    constructor(private loginService: LoginService) { }

    ngOnInit(): void {
        this.credentialSubscription = this.loginService.credentials$.subscribe(c => this.credentials = c);
    }

    ngOnDestroy() {
        this.credentialSubscription.unsubscribe();
    }

    public onSidenavClose = () => {
        this.sidenavClose.emit();
    }
}
