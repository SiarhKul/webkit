import { AppDataSource } from './src/integrations/data-source'
import logger from './src/integrations/logger'

async function fixUserNamesInBatches() {
  const BATCH_SIZE = 2
  let totalUpdated = 0
  let affected = 0

  await AppDataSource.initialize()
  console.log('START')

  const count: unknown = await AppDataSource.query(`
  Select * from "user" where first_name='Siarhei'
  `)

  console.log('COUNT', count)

  do {
    const result: unknown = await AppDataSource.query(
      `
            WITH rows_to_update AS (
                SELECT id 
                FROM "user" 
                WHERE user_name = $1 
                LIMIT $2
                FOR UPDATE SKIP LOCKED 
            )
            UPDATE "user" 
            SET user_name = $3 
            WHERE id IN (SELECT id FROM rows_to_update);
        `,
      ['Siarhei', BATCH_SIZE, 'Sia']
    )
    console.log('result-----', result)

    affected = result[1]
    totalUpdated += affected

    if (affected > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  } while (affected > 0)
}

fixUserNamesInBatches().catch(console.error)
