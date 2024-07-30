import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../../../application/dtos/user.dto';
import { UsersCreateUsecase } from '../../../application/useCases/users-create/users-create.usecase';
import { UsersGetOneUsecase } from '../../../application/useCases/users-get-one/users-get-one.usecase';
import { UsersUpdateUsecase } from '../../../application/useCases/users-update/users-update.usecase';
import { UsersDeleteUsecase } from '../../../application/useCases/users-delete/users-delete.usecase';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private userCreateUseCase: UsersCreateUsecase,
    private userGetUseCase: UsersGetOneUsecase,
    private userUpdateUseCase: UsersUpdateUsecase,
    private userDeleteUseCase: UsersDeleteUsecase,
  ) {}

  @Post('/create')
  createUser(@Body() newUser: CreateUserDto) {
    return this.userCreateUseCase.execute(newUser);
  }

  @UseGuards(AuthGuard)
  @Patch(':email')
  updateUser(
    @Param('email') email: string,
    @Body() updatedUserFields: UpdateUserDto,
  ) {
    return this.userUpdateUseCase.execute(email, updatedUserFields);
  }

  @UseGuards(AuthGuard)
  @Get(':email')
  getUser(@Param('email') email: string) {
    return this.userGetUseCase.execute(email);
  }

  @UseGuards(AuthGuard)
  @Delete(':email')
  deleteUser(@Param('email') email: string) {
    return this.userDeleteUseCase.execute(email);
  }
}
