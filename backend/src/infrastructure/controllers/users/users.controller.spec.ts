import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UsersCreateUsecase } from '../../../application/useCases/users-create/users-create.usecase';
import { UsersController } from './users.controller';
import { CreateUserDto } from '../../../application/dtos/user.dto';
import { UsersGetOneUsecase } from '../../../application/useCases/users-get-one/users-get-one.usecase';
import { UserListTransactionsUsecase } from '../../../application/useCases/user-list-transactions/user-list-transactions.usecase';
import { AuthGuard } from '../../../infrastructure/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('UserController', () => {
  let app: INestApplication;
  let userCreateUseCase: UsersCreateUsecase;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersCreateUsecase,
          useValue: { execute: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: UsersGetOneUsecase,
          useValue: { execute: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: UserListTransactionsUsecase,
          useValue: { execute: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: JwtService,
          useValue: { verify: jest.fn().mockResolvedValue({ userId: 1 }) },
        },
        AuthGuard,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    userCreateUseCase = moduleRef.get<UsersCreateUsecase>(UsersCreateUsecase);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should call userCreateUseCase.execute with newUser', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Jhon Doe',
      email: 'Jhon@doe.com',
      address: 'street 123',
      password: '123456',
    };
    const executeSpy = jest
      .spyOn(userCreateUseCase, 'execute')
      .mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .post('/users/create')
      .send(createUserDto)
      .expect(201);

    expect(executeSpy).toHaveBeenCalledWith(createUserDto);
  });
});
