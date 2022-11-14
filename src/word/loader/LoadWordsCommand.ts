import { Command, CommandRunner, Option } from 'nest-commander';
import {
  Conjugation,
  Sense,
  WordEntry,
  WordMeta
} from '../WordEntry.entity';
import * as fs from 'fs';
import * as readLine from 'readline';
import { Inject } from '@nestjs/common';
import { WORD_SERVICE, WordService } from '../WordService';

@Command({ name: 'load-words', description: 'Load words into dictionary' })
export class LoadWordsCommand extends CommandRunner {
  constructor(
    @Inject(WORD_SERVICE) private wordService: WordService
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

    await this.wordService.deleteAll();

    const stream = fs.createReadStream(path);
    const rl = readLine.createInterface({
      input: stream,
      crlfDelay: Infinity
    });

    let objs = [];
    const chunkSize = 1000;
    let count = 0;
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
      objs.push(wordObj);
      if (count < chunkSize) {
        count++;
        continue;
      }
      count = 0;
      await this.wordService.saveAll(objs);
      objs = [];
    }
    if (objs.length) {
      await this.wordService.saveAll(objs);
    }
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
