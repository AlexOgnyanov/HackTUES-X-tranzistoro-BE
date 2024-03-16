import { MigrationInterface, QueryRunner } from "typeorm";

export class Facility1710493849013 implements MigrationInterface {
    name = 'Facility1710493849013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility" ADD "lat" numeric`);
        await queryRunner.query(`ALTER TABLE "facility" ADD "lon" numeric`);
        await queryRunner.query(`ALTER TABLE "facility" ADD "streetName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility" DROP COLUMN "streetName"`);
        await queryRunner.query(`ALTER TABLE "facility" DROP COLUMN "lon"`);
        await queryRunner.query(`ALTER TABLE "facility" DROP COLUMN "lat"`);
    }

}
