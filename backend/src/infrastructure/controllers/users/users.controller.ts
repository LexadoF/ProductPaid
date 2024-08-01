import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../../../application/dtos/user.dto';
import { UsersCreateUsecase } from '../../../application/useCases/users-create/users-create.usecase';
import { UsersGetOneUsecase } from '../../../application/useCases/users-get-one/users-get-one.usecase';
import { UserListTransactionsUsecase } from '../../../application/useCases/user-list-transactions/user-list-transactions.usecase';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private userCreateUseCase: UsersCreateUsecase,
    private userGetUseCase: UsersGetOneUsecase,
    private usersGetTransactionsUseCase: UserListTransactionsUsecase,
  ) {}

  @Post('/create')
  createUser(@Body() newUser: CreateUserDto) {
    return this.userCreateUseCase.execute(newUser);
  }

  @UseGuards(AuthGuard)
  @Get(':email')
  getUser(@Param('email') email: string) {
    return this.userGetUseCase.execute(email);
  }

  @UseGuards(AuthGuard)
  @Get('/transactions/:email')
  getUserTransactions(@Param('email') email: string) {
    return this.usersGetTransactionsUseCase.execute(email);
  }
}
