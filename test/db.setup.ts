import { createConnection } from 'typeorm';
import { config } from 'dotenv';
import { createLangerOrmConfig } from '../src/LangerOrmConfig';

beforeAll(async () => {
  config({ path: '../.env' });
  config({ path: '../.env.test' });

  await setUpDb();
});

async function setUpDb() {
  const langerOrmConfig = createLangerOrmConfig();
  const connection = await createConnection(langerOrmConfig);
  await connection.createQueryRunner().clearDatabase(langerOrmConfig.database);
  await connection.runMigrations({ transaction: 'all' });
  await connection.close();
}
