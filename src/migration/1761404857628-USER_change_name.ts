import { MigrationInterface, QueryRunner } from 'typeorm'

export class USERChangeName1761404857628 implements MigrationInterface {
    name = 'USERChangeName1761404857628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`)
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`)
        await queryRunner.query(
            `ALTER TABLE "user" ADD "first_name" character varying(255) NOT NULL`
        )
        await queryRunner.query(
            `ALTER TABLE "user" ADD "user_name" character varying(255) NOT NULL`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "user_name"`)
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_name"`)
        await queryRunner.query(
            `ALTER TABLE "user" ADD "lastName" character varying(255) NOT NULL`
        )
        await queryRunner.query(
            `ALTER TABLE "user" ADD "firstName" character varying(255) NOT NULL`
        )
    }
}
