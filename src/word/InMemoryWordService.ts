import { WordService } from './WordService';
import { WordEntry } from './WordEntry.entity';
import { plainToInstance } from 'class-transformer';

export class InMemoryWordService implements WordService {
  private words: WordEntry[] = [];

  findWordsBySearch(search: string): Promise<WordEntry[]> {
    return Promise.resolve(this.words.filter(it => it.word.includes(search)));
  }

  saveAll(words: Partial<WordEntry>[]): Promise<void> {
    const wordsToSave = words.map(it => plainToInstance(WordEntry, { ...it, id: Math.random() }));
    this.words = [...this.words, ...wordsToSave];
    return Promise.resolve();
  }

  showWord(id: string): Promise<WordEntry | null> {
    const word = this.words.find(it => it.id === id);
    return Promise.resolve(word || null);
  }

  findAll(): Promise<WordEntry[]> {
    return Promise.resolve(this.words);
  }
}
