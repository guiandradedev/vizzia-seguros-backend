import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceEndorsementController } from './insurance-endorsement.controller';
import { InsuranceEndorsementService } from './insurance-endorsement.service';

describe('InsuranceEndorsementController', () => {
  let controller: InsuranceEndorsementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsuranceEndorsementController],
      providers: [InsuranceEndorsementService],
    }).compile();

    controller = module.get<InsuranceEndorsementController>(InsuranceEndorsementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
