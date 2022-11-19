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
import WordSession from './word-session/WordSession.entity';
import WordSessionEntry from './word-session/WordSessionEntry.entity';
import User from './user/User.entity';
import { UserService } from './user/UserService';
import { AuthService } from './auth/AuthService';
import AuthController from './auth/AuthController';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/LocalStrategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/JwtStrategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(createLangerOrmConfig()),
    TypeOrmModule.forFeature([WordEntry, User, WordSession, WordSessionEntry], 'langer'),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' }
    }),
    CommandRunnerModule.forModule()
  ],
  controllers: [WordController, AuthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    { provide: WORD_SERVICE, useClass: SqlWordService },
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserService,
    LoadWordsCommand
  ]
})
export class AppModule {}
