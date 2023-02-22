import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { WORD_SERVICE, WordService } from './WordService';
import { WordEntry } from './WordEntry.entity';

@Controller()
export class WordController {
  constructor(@Inject(WORD_SERVICE) private readonly wordService: WordService) {}

  @Get('/word/:word')
  findById(@Param('word') word: string): Promise<WordEntry[] | null> {
    return this.wordService.showWords(word);
  }

  @Get('/word/find/:search')
  findBySearchTerm(@Param('search') searchText: string): Promise<WordEntry[]> {
    return this.wordService.findWordsBySearch(searchText);
  }
}
