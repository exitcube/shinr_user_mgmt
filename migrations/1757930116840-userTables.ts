import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTables1757930116840 implements MigrationInterface {
    name = 'UserTables1757930116840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying, "mobile" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "lastActive" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_29fd51e9cf9241d022c5a4e02e6" UNIQUE ("mobile"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_29fd51e9cf9241d022c5a4e02e" ON "user" ("mobile") `);
        await queryRunner.query(`CREATE TABLE "userOtp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "otp" character varying NOT NULL, "otpToken" character varying NOT NULL, "lastRequestedTime" TIMESTAMP NOT NULL, "requestCount" smallint NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e53e492972b6a7f3fd97e34eac8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f9005f69a93cc20f32bd0ce114" ON "userOtp" ("userId") `);
        await queryRunner.query(`CREATE TABLE "userDevice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "lastLogin" TIMESTAMP NOT NULL, "lastActive" TIMESTAMP NOT NULL, "userAgent" character varying NOT NULL, "lastLogoutTime" TIMESTAMP NOT NULL, "ipAddress" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d9d56d85466ed4356ea156d5cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9f3c9ae281195c7c59cb694980" ON "userDevice" ("userId") `);
        await queryRunner.query(`CREATE TABLE "userToken" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "deviceId" uuid, "refreshToken" text NOT NULL, "accessToken" character varying NOT NULL, "refreshTokenExpiry" TIMESTAMP, "refreshTokenStatus" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c1ae321815cc8c22ba7482ccf9f" UNIQUE ("accessToken"), CONSTRAINT "UQ_6ca3a6d662009693f8b9a1c59f3" UNIQUE ("refreshTokenStatus"), CONSTRAINT "PK_57e9636d5325549fd42e0d7a440" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_002c4d6b032daf6b513e1a4cd8" ON "userToken" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ed220e4533fb012a59ce1bd7f5" ON "userToken" ("deviceId") `);
        await queryRunner.query(`ALTER TABLE "userOtp" ADD CONSTRAINT "FK_f9005f69a93cc20f32bd0ce1145" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userDevice" ADD CONSTRAINT "FK_9f3c9ae281195c7c59cb694980a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userToken" ADD CONSTRAINT "FK_002c4d6b032daf6b513e1a4cd8f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userToken" ADD CONSTRAINT "FK_ed220e4533fb012a59ce1bd7f58" FOREIGN KEY ("deviceId") REFERENCES "userDevice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userToken" DROP CONSTRAINT "FK_ed220e4533fb012a59ce1bd7f58"`);
        await queryRunner.query(`ALTER TABLE "userToken" DROP CONSTRAINT "FK_002c4d6b032daf6b513e1a4cd8f"`);
        await queryRunner.query(`ALTER TABLE "userDevice" DROP CONSTRAINT "FK_9f3c9ae281195c7c59cb694980a"`);
        await queryRunner.query(`ALTER TABLE "userOtp" DROP CONSTRAINT "FK_f9005f69a93cc20f32bd0ce1145"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ed220e4533fb012a59ce1bd7f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_002c4d6b032daf6b513e1a4cd8"`);
        await queryRunner.query(`DROP TABLE "userToken"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9f3c9ae281195c7c59cb694980"`);
        await queryRunner.query(`DROP TABLE "userDevice"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f9005f69a93cc20f32bd0ce114"`);
        await queryRunner.query(`DROP TABLE "userOtp"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29fd51e9cf9241d022c5a4e02e"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
