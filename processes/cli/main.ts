import { CommandFactory } from 'nest-commander';
import { AppModule } from '../../src/AppModule';

async function bootstrap() {
  await CommandFactory.run(AppModule, ['warn', 'error']);
}

bootstrap();
