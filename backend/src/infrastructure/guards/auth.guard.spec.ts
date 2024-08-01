import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { jwtSecret } from '../database/enviromental.config';
import { Request } from 'express';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = moduleRef.get<AuthGuard>(AuthGuard);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should allow access with a valid token', async () => {
    const mockExecutionContext =
      createMockExecutionContext('Bearer validToken');
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ userId: 1 });

    const result = await authGuard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('validToken', {
      secret: jwtSecret,
    });
  });

  it('should throw UnauthorizedException with an invalid token', async () => {
    const mockExecutionContext = createMockExecutionContext(
      'Bearer invalidToken',
    );
    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error());

    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('invalidToken', {
      secret: jwtSecret,
    });
  });

  it('should throw UnauthorizedException with no token', async () => {
    const mockExecutionContext = createMockExecutionContext('');

    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  function createMockExecutionContext(
    authorizationHeader: string,
  ): ExecutionContext {
    const req = {
      headers: {
        authorization: authorizationHeader,
      },
    } as unknown as Request;

    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;
  }
});
