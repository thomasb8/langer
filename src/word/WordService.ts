import { WordEntry } from './WordEntry.entity';

export const WORD_SERVICE = Symbol('WORD_SERVICE');

export interface WordService {
  findWordsBySearch(search: string): Promise<WordEntry[]>;

  showWord(id: string): Promise<WordEntry | null>;

  saveAll(words: Partial<WordEntry>[]): Promise<void>;

  findAll(): Promise<WordEntry[]>;
}
