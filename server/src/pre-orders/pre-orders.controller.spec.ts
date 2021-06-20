import { Test, TestingModule } from "@nestjs/testing";
import { PreOrdersController } from "./pre-orders.controller";

describe("PreOrdersController", () => {
  let controller: PreOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreOrdersController],
    }).compile();

    controller = module.get<PreOrdersController>(PreOrdersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
