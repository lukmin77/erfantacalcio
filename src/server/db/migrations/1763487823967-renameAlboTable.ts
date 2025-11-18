import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameAlboTable1763487823967 implements MigrationInterface {
    name = 'RenameAlboTable1763487823967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "AlboTrofei_new" RENAME TO "albo_trofei"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "albo_trofei" RENAME TO "AlboTrofei_new"`);
    }

}
