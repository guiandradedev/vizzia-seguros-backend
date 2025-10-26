import { Test, TestingModule } from '@nestjs/testing';
import { ConductorsTelephoneController } from './conductors_telephone.controller';
import { ConductorsTelephoneService } from './conductors_telephone.service';

describe('ConductorsTelephoneController', () => {
  let controller: ConductorsTelephoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConductorsTelephoneController],
      providers: [ConductorsTelephoneService],
    }).compile();

    controller = module.get<ConductorsTelephoneController>(ConductorsTelephoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
