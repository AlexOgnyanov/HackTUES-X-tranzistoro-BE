import { MigrationInterface, QueryRunner } from "typeorm";

export class Facility1710433685887 implements MigrationInterface {
    name = 'Facility1710433685887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "facility" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "thumbnailId" integer, CONSTRAINT "REL_770ff08a3b3ad7ce95ecff76b7" UNIQUE ("thumbnailId"), CONSTRAINT "PK_07c6c82781d105a680b5c265be6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "file" ADD "galleryId" integer`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_9bced6619279a7472fdcfec6954" FOREIGN KEY ("galleryId") REFERENCES "facility"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "facility" ADD CONSTRAINT "FK_770ff08a3b3ad7ce95ecff76b7a" FOREIGN KEY ("thumbnailId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "facility" DROP CONSTRAINT "FK_770ff08a3b3ad7ce95ecff76b7a"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_9bced6619279a7472fdcfec6954"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "galleryId"`);
        await queryRunner.query(`DROP TABLE "facility"`);
    }

}
