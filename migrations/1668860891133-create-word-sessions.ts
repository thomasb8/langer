import { MigrationInterface, QueryRunner } from 'typeorm';

export class createWordSessions1668860891133 implements MigrationInterface {
  name = 'createWordSessions1668860891133';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "word_session_entry" ("id" SERIAL NOT NULL, "session_id" uuid NOT NULL, "word_id" uuid NOT NULL, CONSTRAINT "PK_31ee4873df6fb9389494abe15f7" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "word_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_3e6a72c0ce61da0bc6a29101202" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "word_session_entry" ADD CONSTRAINT "FK_d85b50576df9448441b1541621f" FOREIGN KEY ("session_id") REFERENCES "word_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "word_session_entry" ADD CONSTRAINT "FK_3a69c73c76e706905560a2a16a0" FOREIGN KEY ("word_id") REFERENCES "word_entry"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "word_session" ADD CONSTRAINT "FK_9658a22a2800cd8be84f68cb1d5" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "word_session" DROP CONSTRAINT "FK_9658a22a2800cd8be84f68cb1d5"`);
    await queryRunner.query(`ALTER TABLE "word_session_entry" DROP CONSTRAINT "FK_3a69c73c76e706905560a2a16a0"`);
    await queryRunner.query(`ALTER TABLE "word_session_entry" DROP CONSTRAINT "FK_d85b50576df9448441b1541621f"`);
    await queryRunner.query(`DROP TABLE "word_session"`);
    await queryRunner.query(`DROP TABLE "word_session_entry"`);
  }

}
