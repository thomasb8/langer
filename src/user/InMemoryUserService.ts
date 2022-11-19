import { UserService } from './UserService';
import User from './User.entity';

export default class InMemoryUserService implements UserService {
  private users: User[] = [];

  create(email: string, passwordHash: string): Promise<User> {
    const user = { email, passwordHash } as User;
    this.users.push(user);
    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find(it => it.email === email));
  }

}
