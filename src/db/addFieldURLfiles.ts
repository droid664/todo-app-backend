import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1713092323492 implements MigrationInterface {
  name = 'Migrations1713092323492'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" ADD "downloadURL" character varying NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "downloadURL"`)
  }
}
