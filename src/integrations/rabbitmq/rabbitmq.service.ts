import * as amqpConnectionManager from 'amqp-connection-manager'
import logger from '../logger'
import { config } from '../config'

class RabbitMQService {
  private connection: amqpConnectionManager.AmqpConnectionManager | null = null
  private channelWrapper: amqpConnectionManager.ChannelWrapper | null = null
  private isInitialized = false

  async initialize(): Promise<void> {
    if (!config.RABBITMQ_ENABLED) {
      logger.info('RabbitMQ is disabled in configuration')
      return
    }

    try {
      await this.connect()
      this.isInitialized = true
      logger.info('RabbitMQ service initialized successfully')
    } catch (error) {
      logger.warn(
        'Failed to initialize RabbitMQ. Server will continue to run.',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  private async connect(): Promise<void> {
    try {
      const url = (config.RABBITMQ_URL as string) || 'amqp://localhost:5672'

      this.connection = amqpConnectionManager.connect([url])

      this.connection.on('connect', () => {
        logger.info('Connected to RabbitMQ')
      })

      this.connection.on('disconnect', (err) => {
        logger.warn(
          'Disconnected from RabbitMQ',
          err?.err?.message || 'Unknown error'
        )
      })

      this.connection.on('connectFailed', (err) => {
        logger.warn(
          'Failed to connect to RabbitMQ',
          err?.err?.message || 'Unknown error'
        )
      })

      this.channelWrapper = this.connection.createChannel({
        json: true,
        setup: () => {
          logger.info('RabbitMQ channel created')
          return Promise.resolve()
        },
      })

      await this.channelWrapper.waitForConnect().catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        logger.warn(
          'Channel connection pending. RabbitMQ may be unavailable.',
          errorMessage
        )
      })
    } catch (error) {
      logger.error(
        'Error initializing RabbitMQ connection',
        error instanceof Error ? error.message : 'Unknown error'
      )
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.channelWrapper) {
      await this.channelWrapper.close()
      this.channelWrapper = null
    }
    if (this.connection) {
      await this.connection.close()
      this.connection = null
    }
    this.isInitialized = false
    logger.info('Disconnected from RabbitMQ')
  }

  getChannel(): amqpConnectionManager.ChannelWrapper {
    if (!this.channelWrapper) {
      throw new Error('RabbitMQ channel is not initialized')
    }
    return this.channelWrapper
  }

  isConnected(): boolean {
    try {
      if (!this.connection || !this.channelWrapper) {
        return false
      }

      const isConnected = this.connection.isConnected()
      if (!isConnected) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  isEnabled(): boolean {
    return config.RABBITMQ_ENABLED && this.isInitialized
  }
}

export const rabbitMQService = new RabbitMQService()
