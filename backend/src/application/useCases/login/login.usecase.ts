import { Injectable } from '@nestjs/common';
import { AuthService } from '../../../infrastructure/services/auth/auth.service';
import { LoginDto } from '../../../application/dtos/auth.dto';

@Injectable()
export class LoginUsecase {
  constructor(private authService: AuthService) {}
  async execute(data: LoginDto): Promise<{ token: string }> {
    return await this.authService.login(data);
  }
}
