import { Command, CommandRunner, Option } from 'nest-commander';
import {
  Conjugation, RelatedWord,
  Sense,
  WordEntry,
  WordMeta
} from '../WordEntry.entity';
import * as fs from 'fs';
import * as readLine from 'readline';
import { InjectLangerRepository } from '../../InjectLangerRepository';
import { Repository } from 'typeorm';

@Command({ name: 'load-words', description: 'Load words into dictionary' })
export class LoadWordsCommand extends CommandRunner {
  constructor(
    @InjectLangerRepository(WordEntry) private repository: Repository<WordEntry>
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options: { path: string }
  ): Promise<void> {
    const path = options.path;
    if (!fs.existsSync(path)) {
      throw new Error(`Input file: ${path} does not exist`);
    }

    await this.repository.delete({});

    const stream = fs.createReadStream(path);
    const rl = readLine.createInterface({
      input: stream,
      crlfDelay: Infinity
    });

    const altMap = new Map<string, Array<{ id: string, word: string }>>();
    const insertedWordsMap: Record<string, string> = {};
    let objs = [];
    const chunkSize = 1000;
    let count = 0;
    let totalCount = 0;
    for await (const line of rl) {
      const obj = JSON.parse(line);
      let meta;
      if (obj.pos === 'noun') {
        const plural = (obj.head_templates?.[0]?.expansion as string)?.match(/plural\s(?:(.*),|\))/)?.[1] || '';
        const gender = obj.head_templates?.[0]?.args?.[1]?.substring(0, 1) || '';
        meta = { gender, plural } as WordMeta;
      }
      const conjugations = obj.forms?.map((it: Conjugation) => ({ form: it.form, tags: it.tags } as Conjugation)) || [];
      const senses = obj.senses.map((it: RawSense) => {
        return ({
          meaning: it.raw_glosses?.[0] || it.glosses?.[0] || '',
          examples: it.examples?.filter(it => it.type === 'example').map(it => ({
            text: it.text,
            translation: it.english
          })) || []
        } as Sense);
      });
      let formOf: RelatedWord | undefined;
      if (obj.senses?.[0]?.form_of) {
        formOf = { word: obj.senses[0].form_of[0].word, id: '' };
      }
      const wordObj: Partial<WordEntry> = {
        word: obj.word,
        position: obj.pos,
        conjugations,
        senses: senses
      };
      if (meta) {
        wordObj.gender = meta.gender;
        wordObj.plural = meta.plural;
      }
      if (formOf) {
        wordObj.formOf = [formOf];
      }
      objs.push(wordObj);
      if (count < chunkSize) {
        count++;
        continue;
      }
      count = 0;
      totalCount += chunkSize;
      const savedWords = await this.repository.save(objs);
      savedWords.forEach(it => insertedWordsMap[it.word] = it.id);
      console.clear();
      console.log(`Saved ${totalCount} words`);
      savedWords.filter(it => it.formOf).forEach(it => {
        if (!altMap.get(it.formOf![0].word)) {
          altMap.set(it.formOf![0].word, []);
        }
        altMap.get(it.formOf![0].word)!.push({ id: it.id, word: it.word });
      });
      objs = [];
    }

    if (objs.length) {
      const savedWords = await this.repository.save(objs);
      savedWords.forEach(it => insertedWordsMap[it.word] = it.id);
      console.clear();
      console.log(`Saved ${totalCount} words`);
      savedWords.filter(it => it.formOf).forEach(it => {
        if (!altMap.get(it.formOf![0].word)) {
          altMap.set(it.formOf![0].word, []);
        }
        altMap.get(it.formOf![0].word)!.push({ id: it.id, word: it.word });
      });
    }

    await Promise.all(Array.from(altMap.entries()).map((entry, i) => {
      const id = insertedWordsMap[entry[0]];
      if (id) {
        console.clear();
        console.log(`Update ${i} from ${altMap.size} entries`);
        return this.repository.update(entry[1].map(w => w.id), { formOf: [{ word: entry[0], id }] });
      }
    }));
  }

  @Option({
    flags: '--path [string]',
    required: true,
    description: 'Path to the wiktionary json to parse'
  })
  useFilePath(path: string): string {
    return path;
  }
}

interface RawSense {
  raw_glosses?: string[],
  glosses?: string[]
  examples?: { text: string, english: string, type: 'example' }[]
}
