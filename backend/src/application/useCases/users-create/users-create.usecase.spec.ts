import { UsersCreateUsecase } from './users-create.usecase';

describe('UsersCreateUsecase', () => {
  it('should be defined', () => {
    expect(new UsersCreateUsecase()).toBeDefined();
  });
});
