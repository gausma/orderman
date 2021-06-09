import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationsController } from './communications.controller';

describe('CommunicationsController', () => {
  let controller: CommunicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunicationsController],
    }).compile();

    controller = module.get<CommunicationsController>(CommunicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
