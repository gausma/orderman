import { Test, TestingModule } from "@nestjs/testing";
import { AuthenticationsService } from "./authentications.service";

describe("AuthenticationsService", () => {
  let service: AuthenticationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationsService],
    }).compile();

    service = module.get<AuthenticationsService>(AuthenticationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
