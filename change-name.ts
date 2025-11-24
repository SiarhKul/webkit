import { AppDataSource } from './src/integrations/data-source'

async function fixUserNamesInBatches() {
  const BATCH_SIZE = 10000
  let totalUpdated = 0
  let affected = 0

  await AppDataSource.initialize()

  console.log('Начинаем пакетное обновление через Raw SQL...')

  do {
    const result = await AppDataSource.query(
      `
            WITH rows_to_update AS (
                SELECT id 
                FROM "user" 
                WHERE user_name = $1 
                LIMIT $2
                FOR UPDATE SKIP LOCKED -- Опционально: позволяет запускать скрипт в несколько потоков
            )
            UPDATE "user" 
            SET user_name = $3 
            WHERE id IN (SELECT id FROM rows_to_update);
        `,
      ['Siarhei', BATCH_SIZE, 'Sia']
    )

    affected = result[1]
    totalUpdated += affected

    console.log(
      `Пакет обработан. Обновлено: ${affected}. Всего: ${totalUpdated}`
    )

    if (affected > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  } while (affected > 0)

  console.log(`Готово! Всего обновлено записей: ${totalUpdated}`)
}

fixUserNamesInBatches().catch(console.error)
