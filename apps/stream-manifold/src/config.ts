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
     * Exchange that is used for stream messages
     */
    streamExchangeName: env('RMQ_STREAM_EXCHANGE_NAME', 'nss.stream'),

    /**
     * NSS microservice queue name
     */
    apiQueueName: env('RMQ_API_QUEUE_NAME', `nss.api`),
  },

  http: {
    /**
     * Header which contains the auth token used for to authenticate the connection
     */
    authTokenHeader: env('HTTP_AUTH_TOKEN_HEADER', 'x-auth-token'),

    /**
     * Whether the connection is behind a proxy like Cloudflare
     */
    behindProxy: envBool('HTTP_BEHIND_PROXY', false),
  },
});
