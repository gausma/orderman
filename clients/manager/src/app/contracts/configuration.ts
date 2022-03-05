export class Configuration {
    analyseText: {
        scan: {
            name1: string,
            name2: string,
            menus: {
                name: string,
                pattern: string,
            }[],
            eventNameDefault: string,
            events: {
                name: string,
                pattern: string,
            }[],
            communicationValue: string,
            communicationNameDefault: string,
            communications: {
                name: string,
                pattern: string,
            }[],
        }
    }
}
