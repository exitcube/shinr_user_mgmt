import { MigrationInterface, QueryRunner } from "typeorm";

export class NewColumn1760588218761 implements MigrationInterface {
    name = 'NewColumn1760588218761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userAddress" ADD "nickName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userAddress" DROP COLUMN "nickName"`);
    }

}
