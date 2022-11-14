import { Controller, Get, Inject, Param } from '@nestjs/common';
import { WORD_SERVICE, WordService } from './WordService';
import { WordEntry } from './WordEntry.entity';

@Controller()
export class WordController {
  constructor(@Inject(WORD_SERVICE) private readonly wordService: WordService) {}

  @Get('/word/:id')
  findById(@Param('id') id: string): Promise<WordEntry | null> {
    return this.wordService.showWord(id);
  }

  @Get('/word/find/:search')
  findBySearchTerm(@Param('search') searchText: string): Promise<WordEntry[]> {
    return this.wordService.findWordsBySearch(searchText);
  }
}
