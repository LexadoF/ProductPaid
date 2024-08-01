import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../../../domain/repository/logins/auth.repository';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../../application/dtos/auth.dto';
interface CustomerModel {
  id: number;
  email: string;
  name: string;
  address: string;
  password: string;
}

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('token'),
    };

    const mockAuthRepository = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuthRepository, useValue: mockAuthRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const user: CustomerModel = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        address: 'Test Address',
        password: 'hashedpassword',
      };

      jest.spyOn(authRepository, 'login').mockResolvedValue(user);

      const result = await service.login(loginDto);

      expect(result).toEqual({ token: 'token' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        name: user.name,
        addres: user.address,
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(authRepository, 'login').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
