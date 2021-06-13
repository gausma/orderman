import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { LoginService } from 'src/app/service/login.service';
import { Login } from 'src/app/contracts/login';

export interface DialogData {
    animal: string;
    name: string;
}


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    animal: string;
    name: string;

    @Output() public sidenavToggle = new EventEmitter();

    constructor(
        public dialog: MatDialog,
        public loginService: LoginService) { }

    ngOnInit(): void {
    }

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }

    public onLogin = () => {
        const dialogRef = this.dialog.open(LoginDialogComponent, {
            width: '250px',
            data: { name: this.name, animal: this.animal }
        });

        dialogRef.afterClosed().subscribe((login: Login) => {
            this.loginService.login(login);
        });
    }
}
