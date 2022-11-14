import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { LoadWordsCommand } from './word/loader/LoadWordsCommand';
import { WordEntry } from './word/WordEntry.entity';
import { ConfigModule } from '@nestjs/config';
import { CommandRunnerModule } from 'nest-commander';
import { WordController } from './word/WordController';
import { WORD_SERVICE } from './word/WordService';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SqlWordService } from './word/SqlWordService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createLangerOrmConfig } from './LangerOrmConfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(createLangerOrmConfig()),
    TypeOrmModule.forFeature([WordEntry], 'langer'),
    CommandRunnerModule.forModule()
  ],
  controllers: [WordController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    { provide: WORD_SERVICE, useClass: SqlWordService },
    LoadWordsCommand
  ]
})
export class AppModule {}
