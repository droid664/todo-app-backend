import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1712430960948 implements MigrationInterface {
  name = 'Migrations1712430960948'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todos" ADD "pin" boolean NOT NULL DEFAULT false`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "pin"`)
  }
}
