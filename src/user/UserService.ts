import { Injectable } from '@nestjs/common';
import { InjectLangerRepository } from '../InjectLangerRepository';
import User from './User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectLangerRepository(User) private readonly repository: Repository<User>) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { email } });
  }

  async create(email: string, passwordHash: string) {
    return this.repository.save({ email, passwordHash });
  }
}
