import { MigrationInterface, QueryRunner } from "typeorm";

export class Facility1710501497336 implements MigrationInterface {
    name = 'Facility1710501497336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."facility_tags_enum" AS ENUM('Power bar', 'Deadlift bar', 'Bumper weights', 'Calibrated weights', 'Crossfit bar', 'Treadmill', 'Stair master', 'Exercise bike', 'Functional trainer', 'Dumbbells', 'Leg press', 'Manual treadmill', 'Combo rack', 'Power rack', 'Smith machine', 'Hip thrust machine', 'Leg extension', 'Hip adductor', 'Hip abductor', 'Leg curl machine', 'Lying leg curl machine', 'Ab machine', 'Heat row machine', 'Pull up machine', 'Delt machine', 'T-bar row', 'Chest press', 'Swedish wall', 'Jump ropes', 'Boxing ring')`);
        await queryRunner.query(`ALTER TABLE "facility" ADD "tags" "public"."facility_tags_enum" array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "facility" ADD "companyId" integer`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_5b0258d55c8e7bc17ffa199f8ba" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_5b0258d55c8e7bc17ffa199f8ba"`);
        await queryRunner.query(`ALTER TABLE "facility" DROP COLUMN "companyId"`);
        await queryRunner.query(`ALTER TABLE "facility" DROP COLUMN "tags"`);
        await queryRunner.query(`DROP TYPE "public"."facility_tags_enum"`);
    }

}
