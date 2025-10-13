import { MigrationInterface, QueryRunner } from "typeorm";

export class NewUserModel1760331223818 implements MigrationInterface {
    name = 'NewUserModel1760331223818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLogoutTime"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "lastLogoutTime" TIMESTAMP`);
    }

}
