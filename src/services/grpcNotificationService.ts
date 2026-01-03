import { credentials, Metadata } from '@grpc/grpc-js'
import {
  NotificationServiceClient,
  SendNotificationRequest,
  SendNotificationResponse,
  NotificationType,
  NotificationPriority,
} from '../grpc/generated/notification.js'

export class GrpcNotificationService {
  private GRPC_URL = 'localhost:50051'
  private client: NotificationServiceClient

  constructor() {
    this.client = new NotificationServiceClient(
      this.GRPC_URL,
      credentials.createInsecure()
    )
  }

  async sendNotification(): Promise<SendNotificationResponse> {
    const request: SendNotificationRequest = {
      eventId: `evt_${Date.now()}`,
      userId: 'user_1234567',
      type: NotificationType.EMAIL,
      templateId: 'welcome_email',
      payload: {
        user_name: 'John Doe',
        activation_link: 'https://example.com/activate/abc123',
      },
      priority: NotificationPriority.HIGH,
      retryCount: 3,
      timeoutMs: 5000,
      metadata: {},
    }

    const metaData = new Metadata()
    metaData.add('x-service-id', 'test-client')
    metaData.add('x-request-id', `req_${Date.now()}`)

    return new Promise((resolve, reject) => {
      this.client.sendNotification(request, metaData, (error, response) => {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      })
    })
  }
}
