import { MigrationInterface, QueryRunner } from 'typeorm';

export class makeFirstAndLastNamesNullable1668872149593 implements MigrationInterface {
  name = 'makeFirstAndLastNamesNullable1668872149593';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "first_name" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "last_name" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "last_name" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "first_name" SET NOT NULL`);
  }

}
