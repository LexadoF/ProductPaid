import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../../../application/dtos/user.dto';
import { UsersCreateUsecase } from '../../../application/useCases/users-create/users-create.usecase';
import { UsersGetOneUsecase } from '../../../application/useCases/users-get-one/users-get-one.usecase';

@Controller('users')
export class UsersController {
  constructor(
    private userCreateUseCase: UsersCreateUsecase,
    private userGetUseCase: UsersGetOneUsecase,
  ) {}

  @Post('/create')
  createUser(@Body() newUser: CreateUserDto) {
    return this.userCreateUseCase.execute(newUser);
  }

  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() updatedUserFields: any) {
    return `${id}  ${updatedUserFields}`;
  }

  @Get(':email')
  getUser(@Param('email') email: string) {
    return this.userGetUseCase.execute(email);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return id;
  }
}
