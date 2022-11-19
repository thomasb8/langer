import { LocalStrategy } from './LocalStrategy';
import { AuthService } from './AuthService';
import { UserService } from '../user/UserService';
import { JwtService } from '@nestjs/jwt';
import InMemoryUserService from '../user/InMemoryUserService';
import { UnauthorizedException } from '@nestjs/common';
import { Password } from '../user/Password';

describe('#LocalStrategy', () => {

  let subject: LocalStrategy;
  let userService: UserService;
  const secret = 'secret';
  const email = 'user@mail.com';
  const password = 'password';

  beforeEach(() => {
    userService = new InMemoryUserService();
    userService.create(email, new Password(password).hash());
    subject = new LocalStrategy(new AuthService(userService, new JwtService({ secret } )));
  });

  test('returns user when validated', async () => {
    expect(await subject.validate(email, password)).toMatchObject({ email });
  });

  test('throws exception when user is invalid', () => {
    expect(subject.validate(email, 'wrongpassword')).rejects.toThrow(UnauthorizedException);
  });
});
