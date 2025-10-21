import { MigrationInterface, QueryRunner } from "typeorm";

export class NewColumIsDefault1761037280170 implements MigrationInterface {
    name = 'NewColumIsDefault1761037280170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userAddress" ADD "isDefault" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userAddress" DROP COLUMN "isDefault"`);
    }

}
