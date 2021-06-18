import { Component, OnInit } from '@angular/core';
import { BackupService } from '../service/backup.service';

@Component({
    selector: 'app-backup',
    templateUrl: './backup.component.html',
    styleUrls: ['./backup.component.scss']
})
export class BackupComponent implements OnInit {

    private downloadElement: HTMLElement;
    
    public backupCreated = false;

    constructor(private backupService: BackupService) { }

    ngOnInit(): void {
        this.downloadElement = document.createElement('a');
    }

    backup(): void {
        this.backupService.createBackup().subscribe(backup => {
            this.startDownload('OrderManBackup.json', JSON.stringify(backup));
        });
    }

    createCsv(): void {
        this.backupService.createCsv().subscribe(csv => {
            this.startDownload('OrderMan.csv', csv);
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
        const fileType = 'text/json';
        this.downloadElement.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(text)}`);
        this.downloadElement.setAttribute('download', fileName);

        var event = new MouseEvent("click");
        this.downloadElement.dispatchEvent(event);
    }
}
