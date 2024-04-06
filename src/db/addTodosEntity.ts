import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1712412687129 implements MigrationInterface {
  name = 'Migrations1712412687129'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "todos" ("id" SERIAL NOT NULL, "title" character varying NOT NULL DEFAULT '', "description" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "files" ADD "todoId" integer`)
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_3e4bcbd8fe38213cae99b763522" FOREIGN KEY ("todoId") REFERENCES "todos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_3e4bcbd8fe38213cae99b763522"`)
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "todoId"`)
    await queryRunner.query(`DROP TABLE "todos"`)
  }
}
