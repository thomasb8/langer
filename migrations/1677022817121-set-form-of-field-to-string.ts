import {MigrationInterface, QueryRunner} from "typeorm";

export class setFormOfFieldToString1677022817121 implements MigrationInterface {
    name = 'setFormOfFieldToString1677022817121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_gin"`);
        await queryRunner.query(`ALTER TABLE "word_entry" DROP COLUMN "form_of"`);
        await queryRunner.query(`ALTER TABLE "word_entry" ADD "form_of" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "word_entry" DROP COLUMN "form_of"`);
        await queryRunner.query(`ALTER TABLE "word_entry" ADD "form_of" jsonb`);
        await queryRunner.query(`CREATE INDEX "idx_gin" ON "word_entry" ("word") `);
    }

}
