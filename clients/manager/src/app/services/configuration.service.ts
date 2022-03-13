import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Configuration } from '../contracts/configuration';

@Injectable({
    providedIn: "root"
})
export class ConfigurationService {

    /*
    Hallo Max Mustermann (max.mustermann@gmail.com),

    deine Bestellung für den Besen ToGo des Musikverein Einsingen e.V. ist erfolgreich bei uns eingegangen.
    Zeitraum der Abholung: 17. Oktober 2021, 11:00 bis 14:00 Uhr.

    Deine Bestellung:
    Schlachtplatte mit Sauerkraut: 0
    Kesselfleisch mit Sauerkraut: 1
    Blut-/ und Leberwurst mit Sauerkraut: 1
    Maultaschen mit Kartoffelsalat: 2
    Portion Sauerkraut: 0
    Flammkuchen: 1
    Pizza Margherita: 0
    Pizza Salami: 0
    Tellersulz mit Brot: 0

    Aus hygienischen Gründen werde alle Gerichte ausschließlich in unseren Einwegbehältern ausgegeben. Bitte keine eigenen Gefäße mitbringen!

    Bitte denkt an eure Mund- und Nasenschutz-Masken!

    Wir bedanken uns für deine Bestellung und wünschen dir/euch einen guten Appetit,
    Musikverein Einsingen e.V.

    -----------------------------------------------------------
    Dies ist eine automatisch generierte E-Mail, auf die nicht geantwortet werden kann.

    Der Musikverein Einsingen e.V. darf mich über seine Veranstaltungen per Email informieren. Dazu wird meine Email Adresse abgespeichert. Sie wird ausschließlich vom Musikverein Einsingen e.V. benutzt, nicht weitergegeben und kann jederzeit widerrufen werden
    */    
    private configuration: Configuration = {
        analyseText: {
            scan: {
                name1: "Hallo [^ ]* ([^ ]*) \\([^\\(\\)]*\\),",
                name2: "Hallo ([^ ]*) [^ ]* \\([^\\(\\)]*\\),",
                menus: [
                    {
                        name: "Schlachtplatte",
                        pattern: "Schlachtplatte mit Sauerkraut: ([0-9]*)",
                    },
                    {
                        name: "Kesselfleisch",
                        pattern: "Kesselfleisch mit Sauerkraut: ([0-9]*)",
                    },
                    {
                        name: "Blut-/Leberwurst",
                        pattern: "Blut-/ und Leberwurst mit Sauerkraut: ([0-9]*)",
                    },
                    {
                        name: "Kassler",
                        pattern: "Kassler mit Sauerkraut: ([0-9]*)",
                    },
/*
                    {
                        name: "Maultaschen",
                        pattern: "Maultaschen mit Kartoffelsalat: ([0-9]*)",
                    },
*/
                    {
                        name: "Sauerkraut",
                        pattern: "Portion Sauerkraut: ([0-9]*)",
                    },
                    {
                        name: "Schnitzel + Kartoffelsalat",
                        pattern: "Paniertes Schnitzel m\. Kartoffelsalat: ([0-9]*)",
                    },
                    {
                        name: "Schnitzel + Pommes",
                        pattern: "Paniertes Schnitzel m\. Pommes Frites: ([0-9]*)",
                    },
                    {
                        name: "Pommes",
                        pattern: "Portion Pommes Frites: ([0-9]*)",
                    },
/*                    
                    {
                        name: "Flammkuchen",
                        pattern: "Flammkuchen: ([0-9]*)",
                    },
                    {
                        name: "Pizza Margherita",
                        pattern: "Pizza Margherita: ([0-9]*)",
                    },
                    {
                        name: "Pizza Salami",
                        pattern: "Pizza Salami: ([0-9]*)",
                    },
                    {
                        name: "Tellersülze",
                        pattern: "Tellersulz mit Brot: ([0-9]*)",
                    },
*/
                ],
                eventNameDefault: "Togo",
                events: [
                    {
                        name: "Togo",
                        pattern: "Mitnahme (To Go)",
                    },
                    {
                        name: "Präsenz",
                        pattern: "Verzehr vor Ort",
                    },
                ],
                communicationValue: "Hallo [^ ]* [^ ]* \\(([^\\(\\)]*)\\),",
                communicationNameDefault: "Email",
                communications: [
                    {
                        name: "Email + Werbung",
                        pattern: "Der Musikverein Einsingen e\\.V\\. darf mich über seine Veranstaltungen per Email informieren\\.",
                    },
                ]
            }
        }
    }

    public getConfiguration(): Observable<Configuration> {
        return of(this.configuration);
    }
}
