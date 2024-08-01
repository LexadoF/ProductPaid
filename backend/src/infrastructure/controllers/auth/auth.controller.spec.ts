import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginUsecase } from '../../../application/useCases/login/login.usecase';
import { LoginDto } from '../../../application/dtos/auth.dto';
import { UnauthorizedException } from '@nestjs/common';

const mockLoginUsecase = {
  execute: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let loginUsecase: LoginUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUsecase,
          useValue: mockLoginUsecase,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUsecase = module.get<LoginUsecase>(LoginUsecase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call execute on LoginUsecase with correct data', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const result = { token: 'some-token' };

      jest.spyOn(mockLoginUsecase, 'execute').mockResolvedValue(result);

      expect(await controller.login(loginDto)).toEqual(result);
      expect(mockLoginUsecase.execute).toHaveBeenCalledWith(loginDto);
    });

    it('should handle exceptions from LoginUsecase', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      jest
        .spyOn(mockLoginUsecase, 'execute')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
