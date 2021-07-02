import { Component, OnInit } from "@angular/core";
import { BackupService } from "../services/backup.service";

@Component({
    selector: "app-backup",
    templateUrl: "./backup.component.html",
    styleUrls: ["./backup.component.scss"]
})
export class BackupComponent implements OnInit {

    private downloadElement: HTMLElement;
    
    public backupCreated = false;

    constructor(private backupService: BackupService) { }

    ngOnInit(): void {
        this.downloadElement = document.createElement("a");
    }

    backup(): void {
        this.backupService.createBackup().subscribe(backup => {
            this.startDownload(`OrderManBackup_${this.getDate()}.json`, JSON.stringify(backup));
        });
    }

    createCsv(): void {
        this.backupService.createCsv().subscribe(csv => {
            this.startDownload(`OrderMan_${this.getDate()}.csv`, JSON.stringify(csv));
        });
    }

    restore(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            
            reader.onload = () => {
                const backup = JSON.parse(reader.result as string);
                this.backupService.restorBackup(backup).subscribe(() => {
                    this.backupCreated = true;
                });
            };

            let file = event.target.files[0];
            reader.readAsText(file);
        }
    }

    private startDownload(fileName: string, text: string) {
        const fileType = "text/json";
        this.downloadElement.setAttribute("href", `data:${fileType};charset=utf-8,${encodeURIComponent(text)}`);
        this.downloadElement.setAttribute("download", fileName);

        var event = new MouseEvent("click");
        this.downloadElement.dispatchEvent(event);
    }

    private getDate() : string {
        let date = new Date().toISOString();
        date = date.substr(0, 19);
        date = date.replace("T", "_");
        date = date.replace("-", "");
        date = date.replace("-", "");
        date = date.replace(":", "");
        date = date.replace(":", "");
        return date;
    }
}
