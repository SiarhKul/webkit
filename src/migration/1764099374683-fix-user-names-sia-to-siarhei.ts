import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixUserNamesSiaToSiarhei1764099374683
  implements MigrationInterface
{
  name = 'FixUserNamesSiaToSiarhei1764099374683'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const BATCH_SIZE = 5000
    let totalUpdated = 0
    let affected = 0

    do {
      const result: unknown = await queryRunner.query(
        `
          WITH rows_to_update AS (
            SELECT id
            FROM "user"
            WHERE first_name = $1
            LIMIT $2
            FOR UPDATE SKIP LOCKED
          )
          UPDATE "user"
          SET first_name = $3
          WHERE id IN (SELECT id FROM rows_to_update)
          RETURNING id;
        `,
        ['Sia', BATCH_SIZE, 'Siarhei']
      )

      affected = Array.isArray(result) ? result.length : 0
      totalUpdated += affected

      if (affected > 0) {
        console.log(
          `Batch processed. Updated: ${affected}. Total so far: ${totalUpdated}`
        )
        // Small pause to prevent 100% CPU usage on DB
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    } while (affected > 0)

    console.log(`✅ DONE! Total records updated: ${totalUpdated}`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const BATCH_SIZE = 5000
    let totalUpdated = 0
    let affected = 0

    // Rollback in batches
    do {
      const result: unknown = await queryRunner.query(
        `
          WITH rows_to_update AS (
            SELECT id
            FROM "user"
            WHERE first_name = $1
            LIMIT $2
            FOR UPDATE SKIP LOCKED
          )
          UPDATE "user"
          SET first_name = $3
          WHERE id IN (SELECT id FROM rows_to_update)
          RETURNING id;
        `,
        ['Siarhei', BATCH_SIZE, 'Sia']
      )

      affected = Array.isArray(result) ? result.length : 0
      totalUpdated += affected

      if (affected > 0) {
        console.log(
          `Batch processed. Updated: ${affected}. Total so far: ${totalUpdated}`
        )
        // Small pause to prevent 100% CPU usage on DB
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    } while (affected > 0)

    console.log(`✅ DONE! Total records rolled back: ${totalUpdated}`)
  }
}
