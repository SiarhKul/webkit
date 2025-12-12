import { rabbitMQConsumerService } from '../integrations/rabbitmq/rabbitmq-consumer.service'

class EmployeeRepository {
  static async getAllEmployees() {
    const queue = 'test-queue'

    await rabbitMQConsumerService.consumeQueue(
      queue,
      (message) => {
        console.log(`Processing message from ${queue}:`, message)
      },
      {
        durable: true,
        prefetch: 10,
      }
    )
    return {
      message: `Started consuming queue: ${queue}`,
    }
    // return Promise.resolve([{ id: 1 }, { id: 2 }])
  }
}

export default EmployeeRepository
