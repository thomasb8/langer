import { createConnection } from 'typeorm';
import { createLangerOrmConfig } from '../src/LangerOrmConfig';

beforeAll(async () => {
  await setUpDb();
});

async function setUpDb() {
  const langerOrmConfig = createLangerOrmConfig();
  const connection = await createConnection(langerOrmConfig);
  await connection.createQueryRunner().clearDatabase(langerOrmConfig.database);
  await connection.runMigrations({ transaction: 'all' });
  await connection.close();
}
