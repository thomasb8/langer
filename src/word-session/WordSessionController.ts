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

  @Put('/word-session/:sessionId/:wordId')
  addWord(@Param('sessionId') sessionId: string, @Param('wordId') wordId: string) {
    return this.wordSessionService.addWord(sessionId, wordId);
  }

  @Delete('/word-session/:sessionId/:wordId')
  removeWord(@Param('sessionId') sessionId: string, @Param('wordId') wordId: string) {
    return this.wordSessionService.removeWord(sessionId, wordId);
  }

  @Delete('/word-session/:sessionId')
  deleteSession(@Param('sessionId') sessionId: string) {
    return this.wordSessionService.delete(sessionId);
  }
}
