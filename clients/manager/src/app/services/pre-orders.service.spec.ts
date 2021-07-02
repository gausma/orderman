import { TestBed } from "@angular/core/testing";

import { PreOrdersService } from "./pre-orders.service";

describe("PreOrdersService", () => {
    let service: PreOrdersService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PreOrdersService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
