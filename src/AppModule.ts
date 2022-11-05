import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './AppService';
import { LoadWordsCommand } from './commands/LoadWords';
import { Word, WordSchema } from './schemas/Word.schema';
import * as dotenv from 'dotenv';
import { AppController } from './AppController';
import { ConfigModule } from '@nestjs/config';
import { CommandRunnerModule } from 'nest-commander';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
    ),
    MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }]),
    CommandRunnerModule.forModule()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoadWordsCommand
  ]
})
export class AppModule {}
