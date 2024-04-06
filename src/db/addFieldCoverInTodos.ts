import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1712414693382 implements MigrationInterface {
  name = 'Migrations1712414693382'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todos" ADD "coverId" integer`)
    await queryRunner.query(
      `ALTER TABLE "todos" ADD CONSTRAINT "UQ_55ec0b6954c4006c446aed51ab4" UNIQUE ("coverId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "todos" ADD CONSTRAINT "FK_55ec0b6954c4006c446aed51ab4" FOREIGN KEY ("coverId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "FK_55ec0b6954c4006c446aed51ab4"`)
    await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "UQ_55ec0b6954c4006c446aed51ab4"`)
    await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "coverId"`)
  }
}
