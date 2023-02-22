import { Injectable } from '@nestjs/common';
import { InjectLangerRepository } from '../InjectLangerRepository';
import WordSession from './WordSession.entity';
import { Repository } from 'typeorm';
import User from '../user/User.entity';
import WordSessionEntry from './WordSessionEntry.entity';

@Injectable()
export default class WordSessionService {
  constructor(
    @InjectLangerRepository(WordSession) private readonly repository: Repository<WordSession>,
    @InjectLangerRepository(WordSessionEntry) private readonly wordSessionEntryRepository: Repository<WordSessionEntry>
  ) {}

  list(user: User): Promise<WordSession[]> {
    return this.repository.find({ relations: ['entries'], where: { userId: user.id } });
  }

  getById(sessionId: string): Promise<WordSession | undefined> {
    return this.repository.findOne({ id: sessionId }, { relations: ['entries'] });
  }

  create(user: User): Promise<WordSession> {
    return this.repository.save({ userId: user.id });
  }

  async addWord(sessionId: string, word: string): Promise<void> {
    const wordSession = await this.repository.findOne({ id: sessionId }, { relations: ['entries'] });
    if (!wordSession) {
      throw new Error(`Word session: ${sessionId} does not exist`);
    }
    if (wordSession.entries.find(it => it.word === word)) {
      return;
    }
    await this.wordSessionEntryRepository.insert({ sessionId, word });
  }

  async removeWord(sessionId: string, word: string): Promise<void> {
    const wordSession = await this.repository.findOne({ id: sessionId }, { relations: ['entries'] });
    if (!wordSession) {
      throw new Error(`Word session: ${sessionId} does not exist`);
    }
    if (!wordSession.entries.find(it => it.word === word)) {
      return;
    }
    await this.wordSessionEntryRepository.delete({ sessionId, word: word });
  }


  async delete(sessionId: string): Promise<void> {
    await this.repository.delete({ id: sessionId });
  }
}
