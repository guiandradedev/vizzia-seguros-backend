import { Test, TestingModule } from '@nestjs/testing';
import { UserTelephoneController } from './user_telephone.controller';
import { UserTelephoneService } from './user_telephone.service';

describe('UserTelephoneController', () => {
  let controller: UserTelephoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTelephoneController],
      providers: [UserTelephoneService],
    }).compile();

    controller = module.get<UserTelephoneController>(UserTelephoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
