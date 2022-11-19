import { Injectable } from '@nestjs/common';
import { InjectLangerRepository } from '../InjectLangerRepository';
import User from './User.entity';
import { Repository } from 'typeorm';
import { UserService } from './UserService';

@Injectable()
export class SqlUserService implements UserService {
  constructor(@InjectLangerRepository(User) private readonly repository: Repository<User>) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { email } });
  }

  async create(email: string, passwordHash: string) {
    return this.repository.save({ email, passwordHash });
  }
}
