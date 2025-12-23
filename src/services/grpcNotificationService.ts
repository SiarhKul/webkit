import { join } from 'path'
import { loadSync } from '@grpc/proto-loader'
import {
  loadPackageDefinition,
  credentials,
  ServiceClientConstructor,
  Client,
  GrpcObject,
  Metadata,
} from '@grpc/grpc-js'

export class GrpcNotificationService {
  private GRPC_URL = 'localhost:50051'
  private PROTO_PATH = join(__dirname, '../grpc/proto/notification.proto')
  private packageDefinition = loadSync(this.PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
  private prodotoDescriptor = loadPackageDefinition(this.packageDefinition)
  private notificationProto = this.prodotoDescriptor.notification as GrpcObject
  private client: Client

  constructor() {
    const NotificationServiceConstructor = this.notificationProto
      .NotificationService as ServiceClientConstructor

    this.client = new NotificationServiceConstructor(
      this.GRPC_URL,
      credentials.createInsecure()
    )
  }

  static async sendNotification() {
    const request = {
      event_id: `evt_${Date.now()}`,
      user_id: 'user_1234567',
      type: 'EMAIL',
      template_id: 'welcome_email',
      payload: {
        user_name: 'John Doe',
        activation_link: 'https://example.com/activate/abc123',
      },
      priority: 'HIGH',
      retry_count: 3,
      timeout_ms: 5000,
      metadata: {},
    }

    const metaData = new Metadata()
    metaData.add('x-service-id', 'test-client')
    metaData.add('x-request-id', `req_${Date.now()}`)

    return new Promise((resolve, reject) => {
      this.client.SendNotification(
        request,
        metaData,
        (error: unknown, response) => {
          if (error) {
            reject(error instanceof Error ? error : new Error(String(error)))
          } else {
            console.log(
              '[TEST_FILE] ✅ Response:',
              JSON.stringify(response, null, 2)
            )
            resolve(response)
          }
        }
      )
    })
  }
}
