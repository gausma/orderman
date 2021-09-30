import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "pre-order-add-dialog.component",
    templateUrl: "pre-order-add-dialog.component.html",
})
export class PreOrderAddDialogComponent {
    public text: string;

    constructor(public dialogRef: MatDialogRef<PreOrderAddDialogComponent>) { }

    public onOk(): void {
        this.dialogRef.close({ text: this.text });
    }

    public onCancel(): void {
        this.dialogRef.close();
    }
}
