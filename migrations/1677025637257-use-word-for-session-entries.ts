import {MigrationInterface, QueryRunner} from "typeorm";

export class useWordForSessionEntries1677025637257 implements MigrationInterface {
    name = 'useWordForSessionEntries1677025637257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "word_session_entry" DROP CONSTRAINT "FK_3a69c73c76e706905560a2a16a0"`);
        await queryRunner.query(`ALTER TABLE "word_session_entry" RENAME COLUMN "word_id" TO "word"`);
        await queryRunner.query(`ALTER TABLE "word_session_entry" DROP COLUMN "word"`);
        await queryRunner.query(`ALTER TABLE "word_session_entry" ADD "word" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "word_session_entry" DROP COLUMN "word"`);
        await queryRunner.query(`ALTER TABLE "word_session_entry" ADD "word" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "word_session_entry" RENAME COLUMN "word" TO "word_id"`);
        await queryRunner.query(`ALTER TABLE "word_session_entry" ADD CONSTRAINT "FK_3a69c73c76e706905560a2a16a0" FOREIGN KEY ("word_id") REFERENCES "word_entry"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
