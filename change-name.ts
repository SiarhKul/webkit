import { AppDataSource } from './src/integrations/data-source'

async function fixUserNamesInBatches() {
  const BATCH_SIZE = 5000
  let totalUpdated = 0
  let affected = 0

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }
  console.log('START: Database connected successfully.')

  const countResult: unknown = await AppDataSource.query(
    `SELECT count(*) as cnt FROM "user" WHERE first_name = $1`,
    ['Sia']
  )
  console.log(`Found candidates for update (Siarhei): ${countResult[0].cnt}`)

  do {
    const result: unknown = await AppDataSource.query(
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
      ['Siahei', BATCH_SIZE, 'Siar']
    )

    affected = result[1]
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

fixUserNamesInBatches()
  .catch((err) => console.error('Error:', err))
  .finally(() => AppDataSource.destroy())
