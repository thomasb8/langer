import { Command, CommandRunner } from 'nest-commander';

@Command({ name: 'load-words', description: 'Load words into dictionary' })
export class LoadWordsCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, unknown>
  ): Promise<void> {
    console.log('works');
  }
}
