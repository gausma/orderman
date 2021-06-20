import { Test, TestingModule } from "@nestjs/testing";

import { CommunicationsService } from "./communications.service";

describe("CommunicationsService", () => {
  let service: CommunicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunicationsService],
    }).compile();

    service = module.get<CommunicationsService>(CommunicationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
