import { Test, TestingModule } from "@nestjs/testing";
import { PreOrdersService } from "./pre-orders.service";

describe("PreOrdersService", () => {
  let service: PreOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreOrdersService],
    }).compile();

    service = module.get<PreOrdersService>(PreOrdersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
