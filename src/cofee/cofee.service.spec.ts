import { Test, TestingModule } from '@nestjs/testing';
import { CofeeService } from './cofee.service';

describe('CofeeService', () => {
  let service: CofeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CofeeService],
    }).compile();

    service = module.get<CofeeService>(CofeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
