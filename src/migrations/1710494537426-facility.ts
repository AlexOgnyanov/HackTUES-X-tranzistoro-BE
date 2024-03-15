import { MigrationInterface, QueryRunner } from "typeorm";

export class Facility1710494537426 implements MigrationInterface {
    name = 'Facility1710494537426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_9bced6619279a7472fdcfec6954"`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_9bced6619279a7472fdcfec6954" FOREIGN KEY ("galleryId") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_9bced6619279a7472fdcfec6954"`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_9bced6619279a7472fdcfec6954" FOREIGN KEY ("galleryId") REFERENCES "facility"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
