import { Test, TestingModule } from '@nestjs/testing';
import { CofeeController } from './cofee.controller';
import { CofeeService } from './cofee.service';

describe('CofeeController', () => {
  let controller: CofeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CofeeController],
      providers: [CofeeService],
    }).compile();

    controller = module.get<CofeeController>(CofeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
