import { MigrationInterface, QueryRunner } from "typeorm";

export class Company1710416867603 implements MigrationInterface {
    name = 'Company1710416867603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "name"`);
    }

}
