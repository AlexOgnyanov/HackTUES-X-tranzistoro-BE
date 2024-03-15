import { MigrationInterface, QueryRunner } from "typeorm";

export class Department1710504862823 implements MigrationInterface {
    name = 'Department1710504862823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_5b0258d55c8e7bc17ffa199f8ba"`);
        await queryRunner.query(`CREATE TYPE "public"."department_type_enum" AS ENUM('Crossfit', 'Free weight', 'Powerlifting', 'Running', 'Cardio')`);
        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" "public"."department_type_enum" NOT NULL, "facilityId" integer, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_6215c94b7d6fdca4e5fed0db16d" FOREIGN KEY ("facilityId") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_5b0258d55c8e7bc17ffa199f8ba" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_5b0258d55c8e7bc17ffa199f8ba"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_6215c94b7d6fdca4e5fed0db16d"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TYPE "public"."department_type_enum"`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_5b0258d55c8e7bc17ffa199f8ba" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
