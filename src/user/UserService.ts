import User from './User.entity';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface UserService {
  findByEmail(email: string): Promise<User | null>;
  create(email: string, passwordHash: string): Promise<User>;
}
