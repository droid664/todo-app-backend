import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1712413117871 implements MigrationInterface {
  name = 'Migrations1712413117871'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todos" ADD "userId" integer`)
    await queryRunner.query(
      `ALTER TABLE "todos" ADD CONSTRAINT "FK_4583be7753873b4ead956f040e3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "FK_4583be7753873b4ead956f040e3"`)
    await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "userId"`)
  }
}
