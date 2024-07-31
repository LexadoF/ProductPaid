import { TransactionRepository } from './transaction.repository';

describe('TransactionRepository', () => {
  it('should be defined', () => {
    expect(new TransactionRepository()).toBeDefined();
  });
});
