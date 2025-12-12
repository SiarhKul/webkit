import * as amqp from 'amqplib'
import logger from '../logger'
import { rabbitMQService } from './rabbitmq.service'

interface ConsumeQueueOptions {
  durable?: boolean
  prefetch?: number
}

class RabbitMQConsumerService {
  async consumeQueue(
    queue: string,
    callback: (message: unknown) => Promise<void> | void,
    options?: ConsumeQueueOptions
  ): Promise<void> {
    if (!rabbitMQService.isEnabled()) {
      logger.warn('RabbitMQ is not enabled. Cannot consume queue:', queue)
      return
    }

    try {
      const channelWrapper = rabbitMQService.getChannel()

      await channelWrapper.addSetup(async (channel: amqp.Channel) => {
        await channel.assertQueue(queue, {
          durable: options?.durable ?? true,
        })

        if (options?.prefetch) {
          await channel.prefetch(options.prefetch)
        }

        logger.info(`Starting to consume queue: ${queue}`)

        await channel.consume(
          queue,
          (msg: amqp.ConsumeMessage | null) => {
            if (!msg) {
              return
            }

            void (async () => {
              try {
                const content: unknown = JSON.parse(msg.content.toString())
                logger.info(`Received message from queue: ${queue}`, content)

                await callback(content)

                channel.ack(msg)
              } catch (error) {
                logger.error(
                  `Error processing message from queue ${queue}:`,
                  error
                )
                channel.nack(msg, false, false) // Reject and don't requeue
              }
            })()
          },
          {
            noAck: false,
          }
        )
      })
    } catch (error) {
      logger.error(`Error consuming queue ${queue}:`, error)
      throw error
    }
  }

  /**
   * Start consuming messages from an exchange with a routing key
   * @param exchange - Exchange name
   * @param routingKey - Routing key pattern (e.g., 'user.created', 'order.*')
   * @param queue - Queue name to create and bind
   * @param callback - Function to process each message
   * @param exchangeType - Type of exchange (topic, direct, fanout, headers)
   */
  async consumeExchange(
    exchange: string,
    routingKey: string,
    queue: string,
    callback: (message: unknown) => Promise<void> | void,
    exchangeType: string = 'topic'
  ): Promise<void> {
    if (!rabbitMQService.isEnabled()) {
      logger.warn('RabbitMQ is not enabled. Cannot consume exchange:', exchange)
      return
    }

    try {
      const channelWrapper = rabbitMQService.getChannel()

      await channelWrapper.addSetup(async (channel: amqp.Channel) => {
        await channel.assertExchange(exchange, exchangeType, {
          durable: true,
        })

        await channel.assertQueue(queue, {
          durable: true,
        })

        await channel.bindQueue(queue, exchange, routingKey)

        logger.info(
          `Starting to consume exchange: ${exchange} with routing key: ${routingKey}`
        )

        await channel.consume(
          queue,
          (msg: amqp.ConsumeMessage | null) => {
            if (!msg) {
              return
            }

            void (async () => {
              try {
                const content: unknown = JSON.parse(msg.content.toString())
                logger.info(
                  `Received message from exchange: ${exchange} with routing key: ${routingKey}`,
                  content
                )

                await callback(content)

                channel.ack(msg)
              } catch (error) {
                logger.error(
                  `Error processing message from exchange ${exchange}:`,
                  error
                )
                channel.nack(msg, false, false)
              }
            })()
          },
          {
            noAck: false,
          }
        )
      })
    } catch (error) {
      logger.error(`Error consuming exchange ${exchange}:`, error)
      throw error
    }
  }
}

// Export singleton instance
export const rabbitMQConsumerService = new RabbitMQConsumerService()
