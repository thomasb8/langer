import { MigrationInterface, QueryRunner } from 'typeorm';

export class addGinIndexForWords1668720298613 implements MigrationInterface {
  name = 'addGinIndexForWords1668720298613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX "idx_gin" ON "word_entry" USING "gin" ("word" "gin_trgm_ops") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_gin"`);
  }

}
