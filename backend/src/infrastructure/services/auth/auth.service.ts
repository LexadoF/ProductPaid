import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../../../application/dtos/auth.dto';
import { AuthRepository } from '../../../domain/repository/logins/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  async login(data: LoginDto): Promise<{ token: string }> {
    const user = await this.authRepository.login(data);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = {
      email: user.email,
      name: user.name,
      addres: user.address,
    };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
