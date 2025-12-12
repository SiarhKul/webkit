import { rabbitMQConsumerService } from '../integrations/rabbitmq/rabbitmq-consumer.service'
import logger from '../integrations/logger'

/**
 * Initialize RabbitMQ consumers
 * This should be called once during application startup
 */
export async function initializeRabbitMQConsumers(): Promise<void> {
  try {
    logger.info('Initializing RabbitMQ consumers...')

    // Consumer for test-queue
    await rabbitMQConsumerService.consumeQueue(
      'test-queue',
      (message: unknown) => {
        logger.info('Processing message from test-queue:', message)
        // Add your business logic here
        // For example: process employee data, send notifications, etc.
      },
      {
        durable: true,
        prefetch: 10,
      }
    )

    logger.info('RabbitMQ consumers initialized successfully')
  } catch (error) {
    logger.error('Error initializing RabbitMQ consumers:', error)
    // Don't throw - allow server to continue even if consumers fail
  }
}
