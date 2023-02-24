import { WordEntry } from './WordEntry.entity';

export const WORD_SERVICE = Symbol('WORD_SERVICE');

export interface WordService {
  findWordsBySearch(search: string): Promise<WordEntry[]>;

  findWordBySearch(search: string): Promise<WordEntry | null>;

  showWords(word: string): Promise<WordEntry[] | null>;

  findByIds(ids: string[]): Promise<WordEntry[]>;

  saveAll(words: Partial<WordEntry>[]): Promise<WordEntry[]>;

  findAll(): Promise<WordEntry[]>;

  deleteAll(): Promise<void>;
}
