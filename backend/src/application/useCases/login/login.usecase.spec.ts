import { LoginUsecase } from './login.usecase';

describe('LoginUsecase', () => {
  it('should be defined', () => {
    expect(new LoginUsecase()).toBeDefined();
  });
});
