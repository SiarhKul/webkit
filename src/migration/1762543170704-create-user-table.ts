import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserTable1762543170704 implements MigrationInterface {
  name = 'CreateUserTable1762543170704'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('User', 'Admin')`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."user_position_enum" AS ENUM('QA', 'Engineer', 'Manager', 'DevOps', 'Product Manager')`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying(255) NOT NULL, "user_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'User', "position" "public"."user_position_enum" NOT NULL DEFAULT 'Manager', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TYPE "public"."user_position_enum"`)
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`)
  }
}
