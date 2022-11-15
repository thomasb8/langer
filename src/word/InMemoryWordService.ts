import { WordService } from './WordService';
import { WordEntry } from './WordEntry.entity';
import { plainToInstance } from 'class-transformer';

export class InMemoryWordService implements WordService {
  private words: WordEntry[] = [];

  findWordsBySearch(search: string): Promise<WordEntry[]> {
    return Promise.resolve(this.words.filter(it => it.word.includes(search)));
  }

  saveAll(words: Partial<WordEntry>[]): Promise<WordEntry[]> {
    const wordsToSave = words.map(it => plainToInstance(WordEntry, { ...it, id: it.id || Math.random().toString() }));
    this.words = [...this.words.filter(it => !wordsToSave.find(newWord => it.id === newWord.id)), ...wordsToSave];
    return Promise.resolve(this.words);
  }

  showWord(id: string): Promise<WordEntry | null> {
    const word = this.words.find(it => it.id === id);
    return Promise.resolve(word || null);
  }

  findAll(): Promise<WordEntry[]> {
    return Promise.resolve(this.words);
  }

  deleteAll(): Promise<void> {
    this.words = [];
    return Promise.resolve();
  }

  findWordBySearch(search: string): Promise<WordEntry | undefined> {
    return Promise.resolve(this.words.find(it => it.word === search));
  }

  findByIds(ids: string[]): Promise<WordEntry[]> {
    return Promise.resolve(this.words.filter(it => ids.includes(it.id)));
  }
}
