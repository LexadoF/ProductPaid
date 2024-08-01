import { Test, TestingModule } from '@nestjs/testing';
import { LoginUsecase } from './login.usecase';
import { AuthService } from '../../../infrastructure/services/auth/auth.service';
import { LoginDto } from '../../../application/dtos/auth.dto';

const mockAuthService = {
  login: jest.fn(),
};

describe('LoginUsecase', () => {
  let usecase: LoginUsecase;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUsecase,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    usecase = module.get<LoginUsecase>(LoginUsecase);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('execute', () => {
    it('should call login with correct data and return a token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = { token: 'some-token' };

      jest.spyOn(mockAuthService, 'login').mockResolvedValue(result);

      expect(await usecase.execute(loginDto)).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle errors from AuthService', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const error = new Error('Login failed');

      jest.spyOn(mockAuthService, 'login').mockRejectedValue(error);

      await expect(usecase.execute(loginDto)).rejects.toThrow(error);
    });
  });
});
