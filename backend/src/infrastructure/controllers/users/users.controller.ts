import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post('/create')
  createUser(@Body() newUser: any) {
    console.log(newUser);
    return 'create works';
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
