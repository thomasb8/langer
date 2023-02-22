import { Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import JwtAuthGuard from '../JwtAuthGuard';
import WordSessionService from './WordSessionService';
import User from '../user/User.entity';

@Controller()
@UseGuards(JwtAuthGuard)
export default class WordSessionController {

  constructor(private readonly wordSessionService: WordSessionService) {}

  @Get('/word-session')
  list(@Req() req: { user: User }) {
    return this.wordSessionService.list(req.user);
  }

  @Get('/word-session/:sessionId')
  getById(@Param('sessionId') sessionId: string) {
    return this.wordSessionService.getById(sessionId);
  }

  @Post('/word-session/create')
  create(@Req() req: { user: User }) {
    return this.wordSessionService.create(req.user);
  }

  @Put('/word-session/:sessionId/:word')
  addWord(@Param('sessionId') sessionId: string, @Param('word') word: string) {
    return this.wordSessionService.addWord(sessionId, word);
  }

  @Delete('/word-session/:sessionId/:word')
  removeWord(@Param('sessionId') sessionId: string, @Param('word') word: string) {
    return this.wordSessionService.removeWord(sessionId, word);
  }

  @Delete('/word-session/:sessionId')
  deleteSession(@Param('sessionId') sessionId: string) {
    return this.wordSessionService.delete(sessionId);
  }
}
