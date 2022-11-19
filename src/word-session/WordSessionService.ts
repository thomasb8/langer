import { Injectable } from '@nestjs/common';
import { InjectLangerRepository } from '../InjectLangerRepository';
import WordSession from './WordSession.entity';
import { Repository } from 'typeorm';
import User from '../user/User.entity';
import WordSessionEntry from './WordSessionEntry.entity';

@Injectable()
export default class WordSessionService {
  constructor(@InjectLangerRepository(WordSession) private readonly repository: Repository<WordSession>) {}

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
    const entry = new WordSessionEntry();
    entry.sessionId = sessionId;
    entry.wordId = wordId;
    wordSession.entries.push(entry);
    await this.repository.save(wordSession);
  }

  async removeWord(sessionId: string, wordId: string): Promise<void> {
    const wordSession = await this.repository.findOne({ id: sessionId }, { relations: ['entries'] });
    if (!wordSession) {
      throw new Error(`Word session: ${sessionId} does not exist`);
    }
    if (!wordSession.entries.find(it => it.wordId === wordId)) {
      return;
    }
    wordSession.entries = wordSession.entries.filter(it => it.wordId !== wordId);
    await this.repository.delete({ id: sessionId });
    await this.repository.save(wordSession);
  }


  async delete(sessionId: string): Promise<void> {
    await this.repository.delete({ id: sessionId });
  }
}
