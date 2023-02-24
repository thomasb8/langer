import { Test, TestingModule } from '@nestjs/testing';
import { WordEntry } from '../src/word/WordEntry.entity';
import { LoadWordsCommand } from '../src/word/loader/LoadWordsCommand';
import { WORD_SERVICE, WordService } from '../src/word/WordService';
import { plainToInstance } from 'class-transformer';
import { AppModule } from '../src/AppModule';
describe('#LoadWordsCommand', () => {
  let subject: LoadWordsCommand;
  let wordService: WordService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    subject = module.get<LoadWordsCommand>(LoadWordsCommand);
    wordService = module.get<WordService>(WORD_SERVICE);
  });

  test('Fail on invalid path', () => {
    expect(subject.run([], { path: 'invalid.json' })).rejects.toThrow('Input file: invalid.json does not exist');
  });

  test('Load words into database', async () => {
    await subject.run([], { path: './e2e/test-input.json' });
    const models: WordEntry[] = await wordService.findAll();
    expect(models.length).toEqual(3);
  });

  test('Correctly loads basic fields for a verb', async () => {
    await subject.run([], { path: './e2e/test-input.json' });
    const verb: WordEntry = plainToInstance(WordEntry, (await wordService.findWordBySearch('ablenken')));
    expect(verb.word).toEqual('ablenken');
    expect(verb.senses).toEqual([expect.objectContaining({ meaning: '(transitive) to divert', examples: [] }),
      expect.objectContaining({ meaning: '(transitive) to distract', examples: [] })]);
    expect(verb.position).toEqual('verb');
    expect(verb.gender).toEqual(null);
    expect(verb.plural).toEqual(null);
    expect(verb.conjugations.length).toEqual(127);
    expect(verb.conjugations[0]).toEqual({ form: 'lenkt ab', tags: ['present', 'singular', 'third-person'] });
  });

  test('Correctly loads basic fields for a noun', async () => {
    await subject.run([], { path: './e2e/test-input.json' });
    const verb: WordEntry = plainToInstance(WordEntry, (await wordService.findWordBySearch('Kind')));
    expect(verb.word).toEqual('Kind');
    expect(verb.senses).toEqual([
      { meaning: 'kid; child (young person)', examples: [] },
      { meaning: 'child; offspring (person with regard to his or her parents; also a baby animal or young animal, especially as the second component in numerous compound nouns)',
        examples: [
          { text :'Er war das zweitgeborene Kind in der Familie.', translation:'He was the second-born child in the family.' },
          { text :'Er ist das Kind zweier blinder Eltern.', translation: 'He is the child of two blind parents.' }
        ] }]);
    expect(verb.position).toEqual('noun');
    expect(verb.gender).toEqual('n');
    expect(verb.plural).toEqual('Kinder');
    expect(verb.conjugations.length).toEqual(16);
    expect(verb.conjugations[0]).toEqual({ form: 'Kindes', tags: ['genitive'] });
  });
});
