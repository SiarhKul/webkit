import { MigrationInterface, QueryRunner } from 'typeorm'

export class USERAddPasswordRole1761404616445 implements MigrationInterface {
    name = 'USERAddPasswordRole1761404616445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`)
        await queryRunner.query(
            `ALTER TABLE "user" ADD "password" character varying NOT NULL`
        )
        await queryRunner.query(
            `CREATE TYPE "public"."user_role_enum" AS ENUM('User', 'Admin')`
        )
        await queryRunner.query(
            `ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'User'`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`)
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`)
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`)
        await queryRunner.query(`ALTER TABLE "user" ADD "age" integer NOT NULL`)
    }
}
