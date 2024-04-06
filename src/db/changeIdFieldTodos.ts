import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1712429963426 implements MigrationInterface {
    name = 'Migrations1712429963426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_3e4bcbd8fe38213cae99b763522"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "todoId"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "todoId" uuid`);
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "PK_ca8cafd59ca6faaf67995344225"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_3e4bcbd8fe38213cae99b763522" FOREIGN KEY ("todoId") REFERENCES "todos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_3e4bcbd8fe38213cae99b763522"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "PK_ca8cafd59ca6faaf67995344225"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "todoId"`);
        await queryRunner.query(`ALTER TABLE "files" ADD "todoId" integer`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_3e4bcbd8fe38213cae99b763522" FOREIGN KEY ("todoId") REFERENCES "todos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
