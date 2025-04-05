import { buildConfig } from '@nss/utils';

export const config = buildConfig((e) => ({
  app: {
    /**
     * Port the app is exposed on
     */
    port: e.getInt('APP_PORT', 10, 3000),
  },

  log: {
    /**
     * Which level should be logged
     */
    level: e.get('LOG_LEVEL', 'info'),

    /**
     * To pretty format the logs
     */
    pretty: e.getBool('LOG_PRETTY', false),
  },

  rabbitmq: {
    /**
     * Urls to connect to RabbitMQ
     */
    urls: e.getSplit('RMQ_URLS', ['amqp://guest:guest@localhost:5672']),

    /**
     * Microservice queue to receive commands from
     */
    apiQueueName: e.get('RMQ_API_QUEUE_NAME', `nss.api`),
  },

  ess: {
    /**
     * Census Service ID for authentication
     */
    serviceId: e.get('ESS_SERVICE_ID'),
  },
}));
