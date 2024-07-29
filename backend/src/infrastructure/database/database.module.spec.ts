import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';

describe('DatabaseModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });
});
