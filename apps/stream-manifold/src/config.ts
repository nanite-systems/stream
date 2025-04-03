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
     * Exchange that is used for stream messages
     */
    streamExchangeName: e.get('RMQ_STREAM_EXCHANGE_NAME', 'nss.stream'),

    /**
     * NSS microservice queue name
     */
    apiQueueName: e.get('RMQ_API_QUEUE_NAME', `nss.api`),
  },

  http: {
    /**
     * Header which contains the auth token used for to authenticate the connection
     */
    authTokenHeader: e.get('HTTP_AUTH_TOKEN_HEADER', 'x-auth-token'),

    /**
     * Whether the connection is behind a proxy like Cloudflare
     */
    behindProxy: e.getBool('HTTP_BEHIND_PROXY', false),
  },
}));
