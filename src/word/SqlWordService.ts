import { Injectable } from '@nestjs/common';
import { WordEntry } from './WordEntry.entity';
import { plainToInstance } from 'class-transformer';
import { WordService } from './WordService';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class SqlWordService implements WordService {
  constructor(@InjectRepository(WordEntry, 'langer') private wordEntryRepository: Repository<WordEntry>) {
  }

  findAll(): Promise<WordEntry[]> {
    return Promise.resolve([]);
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

  async saveAll(words: Partial<WordEntry>[]): Promise<void> {
    await this.wordEntryRepository.save(words);
  }

  async deleteAll() {
    await this.wordEntryRepository.delete({});
  }
}
