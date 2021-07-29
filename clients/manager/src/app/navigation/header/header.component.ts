import { Component, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";

import { LoginDialogComponent } from "../../authentication/login-dialog/login-dialog.component";
import { AuthenticationsService } from '../../services/authentications.service';
import { Login } from "../../contracts/login";
import { AuthenticationCredentials } from '../..//contracts/authentication-credentials';
import { Subscription } from 'rxjs';

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {

    @Output() public sidenavToggle = new EventEmitter();

    public user: string;

    public credentials: AuthenticationCredentials;
    private authenticationSubscription: Subscription;

    constructor(
        public dialog: MatDialog,
        public authenticationsService: AuthenticationsService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.authenticationSubscription = this.authenticationsService.authentications$.subscribe(authentication => {
            this.user = authentication.user;

            if (this.route.children.length === 1) {
                this.route.children[0].data.subscribe((data) => {
                    if(authentication.credentials[data.credentials] != null) {
                        if(!authentication.credentials[data.credentials][data.function]){
                            this.router.navigate(["welcome"]);
                        }
                    }
                });
            } else {
                console.info("Can't evaluate current router data, retourning to welcome screen.");
                this.router.navigate(["welcome"]);
            }
        });

        // Dummy Login, to get the common credentials if the user management is deactivated
        const login: Login = {
            user: "",
            password: "",
        }
        this.authenticationsService.login(login);  
    }

    ngOnDestroy() {
        this.authenticationSubscription.unsubscribe();
    }

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }

    public onLogin = () => {
        const dialogRef = this.dialog.open(LoginDialogComponent, {
            width: "250px"
        });

        dialogRef.afterClosed().subscribe((login: Login) => {
            if (login == null) {
                return;
            }

            this.authenticationsService.login(login);
        });
    }
}
