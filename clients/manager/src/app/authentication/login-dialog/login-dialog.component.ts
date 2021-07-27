import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "login-dialog.component",
    templateUrl: "login-dialog.component.html",
})
export class LoginDialogComponent {

    public user: string;
    public password: string;

    constructor(public dialogRef: MatDialogRef<LoginDialogComponent>) { }

    onOk(): void {
        this.dialogRef.close({ user: this.user || "", password: this.password || "" });
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
