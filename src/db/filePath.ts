import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1712407909068 implements MigrationInterface {
    name = 'Migrations1712407909068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "filePath" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "filePath"`);
    }

}
