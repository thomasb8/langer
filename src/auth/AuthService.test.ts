import { AuthService } from './AuthService';
import InMemoryUserService from '../user/InMemoryUserService';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/UserService';
import bcrypt from 'bcryptjs';

describe('#AuthService', () => {
  let subject: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  const secret = 'secret';
  const email = 'user@mail.com';
  const password = 'password';

  beforeEach(() => {
    userService = new InMemoryUserService();
    jwtService = new JwtService({ secret });
    userService.create(email, password);
    subject = new AuthService(userService, jwtService);
  });

  describe('#validateUser', function() {
    test('return user with valid password', async () => {
      const user = await subject.validateUser(email, password);
      expect(user).toBeDefined();
    });

    test('return null on invalid password', async () => {
      const user = await subject.validateUser(email, 'asd2');
      expect(user).toBeNull();
    });
  });

  describe('#register', function() {
    test('create user if email is not taken', async () => {
      const user = await subject.register({ email: 'user2@mail.com', password });
      expect(user).toBeDefined();
      expect(bcrypt.compareSync(password, user!.passwordHash)).toBeTruthy();
    });

    test('return null if email is already taken', async () => {
      expect(await subject.register({ email, password })).toEqual(null);
    });
  });
});
