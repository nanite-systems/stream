import { env, envSplit } from '@nss/utils';

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
    levels: envSplit('LOG_LEVELS', ['log', 'warn', 'error']),
  },

  rabbitmq: {
    /**
     * Urls to connect to RabbitMQ
     */
    urls: envSplit('RMQ_URLS', ['amqp://guest:guest@localhost:5672']),

    /**
     * Exchange that is used for stream messages
     */
    streamExchangeName: env('RMQ_STREAM_EXCHANGE_NAME', 'nss.stream'),

    /**
     * NSS microservice queue name
     */
    apiQueueName: env('RMQ_API_QUEUE_NAME', `nss.api`),
  },
});
