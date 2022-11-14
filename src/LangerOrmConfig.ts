import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dotenv = require('dotenv');
  dotenv.config();
}

export const createLangerOrmConfig: () => PostgresConnectionOptions = () => {
  return {
    name: 'langer',
    type: 'postgres',
    host: process.env.LANGER_DB_HOST,
    port: Number(process.env.LANGER_DB_PORT),
    username: process.env.LANGER_DB_USER,
    password: process.env.LANGER_DB_PASSWORD,
    database: process.env.LANGER_DB_NAME,

    namingStrategy: new SnakeNamingStrategy(),
    entities: [
      `${__dirname}/**/*.entity{.ts,.js}`
    ],
    migrations: [
      `${__dirname}/../migrations/*{ts,.js}`
    ],
    cli: {
      migrationsDir: './migrations',
      entitiesDir: './src/**/*.entity.ts'
    },
    synchronize: false,
    logger: 'debug',
    logging: 'all'
  };
};
