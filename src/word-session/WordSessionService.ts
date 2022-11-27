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
    return this.repository.find({ relations: ['entries', 'entries.word'], where: { userId: user.id } });
  }

  create(user: User): Promise<WordSession> {
    return this.repository.save({ userId: user.id });
  }

  async addWord(sessionId: string, wordId: string): Promise<void> {
    const wordSession = await this.repository.findOne({ id: sessionId }, { relations: ['entries'] });
    if (!wordSession) {
      throw new Error(`Word session: ${sessionId} does not exist`);
    }
    if (wordSession.entries.find(it => it.wordId === wordId)) {
      return;
    }
    await this.wordSessionEntryRepository.insert({ sessionId, wordId });
  }

  async removeWord(sessionId: string, wordId: string): Promise<void> {
    const wordSession = await this.repository.findOne({ id: sessionId }, { relations: ['entries'] });
    if (!wordSession) {
      throw new Error(`Word session: ${sessionId} does not exist`);
    }
    if (!wordSession.entries.find(it => it.wordId === wordId)) {
      return;
    }
    await this.wordSessionEntryRepository.delete({ sessionId, wordId });
  }


  async delete(sessionId: string): Promise<void> {
    await this.repository.delete({ id: sessionId });
  }
}
