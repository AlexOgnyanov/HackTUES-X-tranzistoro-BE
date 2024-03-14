import { MigrationInterface, QueryRunner } from "typeorm";

export class Company1710418554001 implements MigrationInterface {
    name = 'Company1710418554001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_9bced6619279a7472fdcfec6954"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "galleryId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ADD "galleryId" integer`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_9bced6619279a7472fdcfec6954" FOREIGN KEY ("galleryId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
