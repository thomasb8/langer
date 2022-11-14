import { MigrationInterface, QueryRunner } from 'typeorm';

export class createWords1668383742234 implements MigrationInterface {
  name = 'createWords1668383742234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "word_entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "word" character varying NOT NULL, "position" character varying NOT NULL, "gender" character varying, "plural" character varying, "conjugations" jsonb NOT NULL DEFAULT '[]', "senses" jsonb NOT NULL DEFAULT '[]', "form_of" jsonb, CONSTRAINT "PK_75e1b19bbaa2f8c13cb51fbd4b9" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_3dc96297cd6747088d6c4c5ee8" ON "word_entry" ("word") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_3dc96297cd6747088d6c4c5ee8"`);
    await queryRunner.query(`DROP TABLE "word_entry"`);
  }

}
