import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../../../application/dtos/auth.dto';
import { LoginUsecase } from '../../../application/useCases/login/login.usecase';

@Controller('auth')
export class AuthController {
  constructor(private loginUseCase: LoginUsecase) {}
  @Post('login')
  login(@Body() data: LoginDto) {
    return this.loginUseCase.execute(data);
  }
}
