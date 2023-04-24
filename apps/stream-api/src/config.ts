import { env, envBool, envSplit } from '@nss/utils';

export const config = () => ({
  app: {
    /**
     * Port the app is exposed on
     */
    port: env('APP_PORT', '3000'),
  },

  log: {
    /**
     * Which level should be logged
     */
    level: env('LOG_LEVEL', 'info'),

    /**
     * To pretty format the logs
     */
    pretty: envBool('LOG_PRETTY', false),
  },

  rabbitmq: {
    /**
     * Urls to connect to RabbitMQ
     */
    urls: envSplit('RMQ_URLS', ['amqp://guest:guest@localhost:5672']),

    /**
     * Microservice queue to receive commands from
     */
    apiQueueName: env('RMQ_API_QUEUE_NAME', `nss.api`),
  },

  ess: {
    /**
     * Census Service ID for authentication
     */
    serviceId: env('ESS_SERVICE_ID'),
  },
});
