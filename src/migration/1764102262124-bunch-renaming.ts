import { MigrationInterface, QueryRunner } from 'typeorm'

export class BunchRenaming1764102262124 implements MigrationInterface {
  name = 'BunchRenaming1764102262124'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const BATCH_SIZE = 1000
    const MAX_ITERATIONS = 100000 // Safety limit to prevent infinite loops
    let totalUpdated = 0
    let affected = 0
    let iterations = 0

    console.log('Starting migration: BunchRenaming1764102262124')
    console.log(
      `Looking for rows where first_name = 'Sia' to update to 'Siarhei'`
    )

    do {
      iterations++
      if (iterations > MAX_ITERATIONS) {
        throw new Error(
          `Migration exceeded maximum iterations (${MAX_ITERATIONS}). This may indicate an infinite loop.`
        )
      }

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

      const rows =
        Array.isArray(result) && Array.isArray(result[0]) ? result[0] : []
      affected = rows.length
      totalUpdated += affected

      if (affected > 0) {
        console.log(
          `Batch ${iterations} processed. Updated: ${affected}. Total so far: ${totalUpdated}`
        )
        // Small pause to prevent 100% CPU usage on DB
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    } while (affected > 0)

    console.log(
      `✅ DONE! Total records updated: ${totalUpdated} in ${iterations} iterations`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const BATCH_SIZE = 1000
    const MAX_ITERATIONS = 100000 // Safety limit to prevent infinite loops
    let totalUpdated = 0
    let affected = 0
    let iterations = 0

    console.log('Starting rollback: BunchRenaming1764102262124')
    console.log(
      `Looking for rows where first_name = 'Siarhei' to rollback to 'Sia'`
    )

    // Rollback in batches
    do {
      iterations++
      if (iterations > MAX_ITERATIONS) {
        throw new Error(
          `Migration rollback exceeded maximum iterations (${MAX_ITERATIONS}). This may indicate an infinite loop.`
        )
      }

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

      const rows =
        Array.isArray(result) && Array.isArray(result[0]) ? result[0] : []
      affected = rows.length
      totalUpdated += affected

      if (affected > 0) {
        console.log(
          `Batch ${iterations} processed. Updated: ${affected}. Total so far: ${totalUpdated}`
        )
        // Small pause to prevent 100% CPU usage on DB
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    } while (affected > 0)

    console.log(
      `✅ DONE! Total records rolled back: ${totalUpdated} in ${iterations} iterations`
    )
  }
}
