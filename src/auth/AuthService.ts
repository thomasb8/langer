import { Injectable } from '@nestjs/common';
import { UserService } from '../user/UserService';
import { Password } from '../user/Password';
import User from '../user/User.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload } from './JwtStrategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService) {
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    const pw = new Password(password);
    if (user && pw.isMatching(user.passwordHash)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtTokenPayload = { email: user.email, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload)
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new Error('User already exists');
    }
    const pwHash = new Password(createUserDto.password).hash();
    return await this.userService.create(createUserDto.email, pwHash);
  }
}

export interface CreateUserDto {
  email: string;
  password: string;
}
