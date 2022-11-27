import { Test, TestingModule } from '@nestjs/testing';
import { createLangerOrmConfig } from '../src/LangerOrmConfig';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import WordSession from '../src/word-session/WordSession.entity';
import WordSessionService from '../src/word-session/WordSessionService';
import User from '../src/user/User.entity';
import { USER_SERVICE, UserService } from '../src/user/UserService';
import { SqlUserService } from '../src/user/SqlUserService';
import { WordEntry } from '../src/word/WordEntry.entity';
import WordSessionEntry from '../src/word-session/WordSessionEntry.entity';
import { Connection } from 'typeorm';

describe('#WordSessionService', () => {
  let module: TestingModule;
  let subject: WordSessionService;
  const user: User = {
    email: 'test@user.com',
    passwordHash: 'password'
  } as User;
  const differentUser: User = {
    email: 'test2@user.com',
    passwordHash: 'password'
  } as User;

  const words: Partial<WordEntry>[] = [
    { word: 'ablenken', position: 'verb', senses: [], conjugations: [] }
  ];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(createLangerOrmConfig()),
        TypeOrmModule.forFeature([WordSession, User, WordEntry, WordSessionEntry], 'langer')
      ],
      providers: [
        WordSessionService,
        { provide: USER_SERVICE, useClass: SqlUserService }
      ]
    }).compile();
    const userService = module.get<UserService>(USER_SERVICE);
    const { id } = await userService.create(user.email, user.passwordHash);
    const { id: id2 } = await userService.create(differentUser.email, differentUser.passwordHash);
    user.id = id;
    differentUser.id = id2;
    const wordRepository = module.get<Connection>(getDataSourceToken('langer')).getRepository(WordEntry);
    await wordRepository.save(words);
  });

  beforeEach(async () => {
    subject = module.get<WordSessionService>(WordSessionService);
    const repository = module.get<Connection>(getDataSourceToken('langer')).getRepository(WordSession);
    await repository.delete({});
  });

  afterAll(async () => {
    await module.close();
  });

  test('#create', async () => {
    const session = await subject.create(user);
    expect(session).toBeDefined();
    expect(session.userId).toEqual(user.id);
  });

  test('#list', async () => {
    let list = await subject.list(user);
    expect(list).toHaveLength(0);
    await subject.create(user);
    await subject.create(user);
    await subject.create(differentUser);
    list = await subject.list(user);
    const otherList = await subject.list(differentUser);
    expect(list).toHaveLength(2);
    expect(otherList).toHaveLength(1);
  });

  test('#addWord', async () => {
    const session = await subject.create(user);
    await subject.addWord(session.id, words[0].id!);
    const [createdSession] = await subject.list(user);
    expect(createdSession.entries[0].word.word).toEqual(words[0].word);
  });

  test('#removeWord', async () => {
    const session = await subject.create(user);
    await subject.addWord(session.id, words[0].id!);
    await subject.removeWord(session.id, words[0].id!);
    const [modifiedSession] = await subject.list(user);
    expect(modifiedSession.entries).toHaveLength(0);
  });
});
