import { Injectable } from '@nestjs/common';
import { WordEntry } from './WordEntry.entity';
import { plainToInstance } from 'class-transformer';
import { WordService } from './WordService';
import { ILike, Repository } from 'typeorm';
import { InjectLangerRepository } from '../InjectLangerRepository';

@Injectable()
export class SqlWordService implements WordService {
  constructor(@InjectLangerRepository(WordEntry) private wordEntryRepository: Repository<WordEntry>) {
  }

  findByIds(ids: string[]): Promise<WordEntry[]> {
    return this.wordEntryRepository.findByIds(ids);
  }

  findAll(): Promise<WordEntry[]> {
    return this.wordEntryRepository.find();
  }

  async findWordsBySearch(search: string): Promise<WordEntry[]> {
    return (await this.wordEntryRepository.createQueryBuilder('w').select('w.id, w.word, w.senses').where({ word: ILike(`${search}%`) }).take(100).orderBy('length(w.word)', 'ASC').execute())
      .map((it: WordEntry) => {
        return plainToInstance(WordEntry, it);
      });
  }

  async showWord(id: string): Promise<WordEntry | null> {
    const obj = await this.wordEntryRepository.findOne({ id });
    if (!obj) {
      return null;
    }
    return plainToInstance(WordEntry, obj);
  }

  async saveAll(words: Partial<WordEntry>[]): Promise<WordEntry[]> {
    return await this.wordEntryRepository.save(words);
  }

  async deleteAll() {
    await this.wordEntryRepository.delete({});
  }

  async findWordBySearch(search: string): Promise<WordEntry | undefined> {
    return this.wordEntryRepository.findOne({ where: { word: search } });
  }
}
