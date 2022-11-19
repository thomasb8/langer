import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/AppModule';
import { Connection } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import User from '../src/user/User.entity';
import { Password } from '../src/user/Password';
import { WordEntry } from '../src/word/WordEntry.entity';
import supertest from 'supertest';

describe('#WordSessionController', () => {
  let app: INestApplication;
  let words: WordEntry[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app
      .init();
    app.useLogger(new Logger());
  });

  beforeEach(async () => {
    const userRepository = app.get<Connection>(getDataSourceToken('langer')).getRepository(User);
    const wordRepository = app.get<Connection>(getDataSourceToken('langer')).getRepository(WordEntry);
    await userRepository.delete({});
    await userRepository.insert({
      id: '4794b9f5-19be-4f78-9d3e-de1fd2d3700f',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@user.com',
      passwordHash: new Password('password').hash()
    });
    await wordRepository.delete({});
    await wordRepository.insert({ word: 'Kind', position: 'noun' });
    await wordRepository.insert({ word: 'Apfel', position: 'noun' });
    await wordRepository.insert({ word: 'ablenken',  position: 'verb' });
    words = await wordRepository.find({});
  });

  afterAll(async () => {
    await app.close();
  });

  test('create a new word session', async () => {
    const agent = supertest(app.getHttpServer());
    const loginResponse = await agent.post('/auth/login').send({ email: 'test@user.com', password: 'password' });
    const resp = await agent.post('/word-session/create').set('Authorization', `Bearer ${loginResponse.body.accessToken}`);
    expect(resp.body).toMatchObject({
      id: expect.any(String),
      createdAt: expect.any(String)
    });
  });

  test('add word to word session', async () => {
    const currentWord = words[0];
    const agent = supertest(app.getHttpServer());
    const loginResponse = await agent.post('/auth/login').send({ email: 'test@user.com', password: 'password' });
    const { id }  = (await agent.post('/word-session/create').set('Authorization', `Bearer ${loginResponse.body.accessToken}`)).body;
    await agent.put(`/word-session/${id}/${currentWord.id}`).set('Authorization', `Bearer ${loginResponse.body.accessToken}`);
    const sessions = (await agent.get('/word-session').set('Authorization', `Bearer ${loginResponse.body.accessToken}`)).body;
    expect(sessions).toMatchObject([{ id, entries: [{ word: expect.objectContaining({ word: currentWord.word }) }] }]);
  });

  test('remove word from word session', async () => {
    const currentWord = words[0];
    const agent = supertest(app.getHttpServer());
    const loginResponse = await agent.post('/auth/login').send({ email: 'test@user.com', password: 'password' });
    const { id }  = (await agent.post('/word-session/create').set('Authorization', `Bearer ${loginResponse.body.accessToken}`)).body;
    await agent.put(`/word-session/${id}/${currentWord.id}`).set('Authorization', `Bearer ${loginResponse.body.accessToken}`);
    let sessions = (await agent.get('/word-session').set('Authorization', `Bearer ${loginResponse.body.accessToken}`)).body;
    expect(sessions).toMatchObject([{ id, entries: [{ word: expect.objectContaining({ word: currentWord.word }) }] }]);
    await agent.delete(`/word-session/${id}/${currentWord.id}`).set('Authorization', `Bearer ${loginResponse.body.accessToken}`);
    sessions = (await agent.get('/word-session').set('Authorization', `Bearer ${loginResponse.body.accessToken}`)).body;
    expect(sessions).toMatchObject([{ id, entries: [] }]);
  });

  test('delete word session', async () => {
    const currentWord = words[0];
    const agent = supertest(app.getHttpServer());
    const loginResponse = await agent.post('/auth/login').send({ email: 'test@user.com', password: 'password' });
    const { id }  = (await agent.post('/word-session/create').set('Authorization', `Bearer ${loginResponse.body.accessToken}`)).body;
    await agent.put(`/word-session/${id}/${currentWord.id}`).set('Authorization', `Bearer ${loginResponse.body.accessToken}`);
    let sessions = (await agent.get('/word-session').set('Authorization', `Bearer ${loginResponse.body.accessToken}`)).body;
    expect(sessions).toMatchObject([{ id, entries: [{ word: expect.objectContaining({ word: currentWord.word }) }] }]);
    await agent.delete(`/word-session/${id}`).set('Authorization', `Bearer ${loginResponse.body.accessToken}`);
    sessions = (await agent.get('/word-session').set('Authorization', `Bearer ${loginResponse.body.accessToken}`)).body;
    expect(sessions).toMatchObject([]);
  });
});
