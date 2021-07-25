import { TestBed } from "@angular/core/testing";

import { AuthenticationsService } from "./authentications.service";

describe("AuthenticationsService", () => {
    let service: AuthenticationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AuthenticationsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
