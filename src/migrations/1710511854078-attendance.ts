import { MigrationInterface, QueryRunner } from "typeorm";

export class Attendance1710511854078 implements MigrationInterface {
    name = 'Attendance1710511854078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "attendance" ("id" SERIAL NOT NULL, "count" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "cameraId" integer, CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attendance" ADD CONSTRAINT "FK_a02fa22f614aa0b3a26b93355be" FOREIGN KEY ("cameraId") REFERENCES "camera"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT "FK_a02fa22f614aa0b3a26b93355be"`);
        await queryRunner.query(`DROP TABLE "attendance"`);
    }

}
