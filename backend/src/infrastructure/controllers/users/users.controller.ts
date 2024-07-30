import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/application/dtos/user.dto';
import { UsersCreateUsecase } from 'src/application/useCases/users-create/users-create.usecase';

@Controller('users')
export class UsersController {
  constructor(private userCreateUseCase: UsersCreateUsecase) {}

  @Post('/create')
  createUser(@Body() newUser: CreateUserDto) {
    return this.userCreateUseCase.execute(newUser);
  }

  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() updatedUserFields: any) {
    return `${id}  ${updatedUserFields}`;
  }

  @Get(':id')
  getUser(@Param('id') id: number) {
    return id;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return id;
  }
}
