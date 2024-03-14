import { MigrationInterface, QueryRunner } from "typeorm";

export class Files1710412260504 implements MigrationInterface {
    name = 'Files1710412260504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "logoId" integer, CONSTRAINT "REL_1b087964cd9a3453bef7e178cc" UNIQUE ("logoId"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "url" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "galleryId" integer, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_1b087964cd9a3453bef7e178cce" FOREIGN KEY ("logoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_9bced6619279a7472fdcfec6954" FOREIGN KEY ("galleryId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_9bced6619279a7472fdcfec6954"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_1b087964cd9a3453bef7e178cce"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}
