import { Body, Controller, ForbiddenException, Get, Post, Req, UseGuards } from '@nestjs/common';
import User from '../user/User.entity';
import { LocalAuthGuard } from '../LocalAuthGuard';
import { AuthService, CreateUserDto } from './AuthService';
import JwtAuthGuard from '../JwtAuthGuard';

@Controller()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async login(@Req() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @Post('/auth/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authService.register(createUserDto);
    if (user === null) {
      throw new ForbiddenException();
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth/profile')
  async getProfile(@Req() req: { user: User }) {
    return req.user;
  }
}
