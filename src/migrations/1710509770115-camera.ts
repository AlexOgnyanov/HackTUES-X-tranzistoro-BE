import { MigrationInterface, QueryRunner } from "typeorm";

export class Camera1710509770115 implements MigrationInterface {
    name = 'Camera1710509770115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "camera" ("id" integer NOT NULL, "departmentId" integer, CONSTRAINT "PK_3e6992bc5e67b9f9a6f95a5fe6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "camera" ADD CONSTRAINT "FK_6bd494d3550d3126cc0668bb934" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "camera" DROP CONSTRAINT "FK_6bd494d3550d3126cc0668bb934"`);
        await queryRunner.query(`DROP TABLE "camera"`);
    }

}
