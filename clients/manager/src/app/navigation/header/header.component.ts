import { Component, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";

import { LoginDialogComponent } from "../../auth/login-dialog/login-dialog.component";
import { LoginService } from "../../service/login.service";
import { Login } from "../../contracts/login";
import { Credentials } from "../../contracts/credentials";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {

    @Output() public sidenavToggle = new EventEmitter();

    public user: string;

    constructor(
        public dialog: MatDialog,
        public loginService: LoginService,
        private router: Router,
        private route: ActivatedRoute) { }

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

            const { user, credentials } = this.loginService.login(login);

            this.user =user;

            if (this.route.children.length === 1) {
                this.route.children[0].data.subscribe((data) => {
                    if(credentials[data.credentials] != null) {
                        if(!credentials[data.credentials][data.function]){
                            this.router.navigate(["welcome"]);
                        }
                    }
                });
            } else {
                console.error("Can't evaluate current router data, retourning to welcome screen.");
                this.router.navigate(["welcome"]);
            }
        });
    }
}
