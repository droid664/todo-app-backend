import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1712410105377 implements MigrationInterface {
    name = 'Migrations1712410105377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "filename" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "filename"`);
    }

}
