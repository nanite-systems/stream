import { buildConfig } from '@nss/utils';
import { randomUUID } from 'crypto';

export const config = buildConfig((e) => ({
  app: {
    /**
     * Port the app is exposed on
     */
    port: e.getInt('APP_PORT', 3000),

    /**
     * Unique id given to this application
     */
    id: e.get('APP_ID', randomUUID()),
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
     * Exchange that is used for duplicate messages
     */
    duplicateExchangeName: e.get(
      'RMQ_DUPLICATE_EXCHANGE_NAME',
      'nss.duplicates',
    ),
  },

  ess: {
    /**
     * Census Service ID for authentication
     */
    serviceIds: e.getSplit('ESS_SERVICE_IDS'),

    /**
     * The environment to collect from
     */
    environment: e.get('ESS_ENVIRONMENT'),

    /**
     * The heartbeat interval
     */
    heartbeatInterval: e.getInt('ESS_HEARTBEAT_INTERVAL', 10, 30),

    /**
     * How many seconds to wait before reconnecting
     */
    reconnectDelay: e.getInt('ESS_RECONNECT_DELAY', 10, 5) * 1000,

    /**
     * How many seconds to wait before reconnecting
     */
    cycleDelay: e.getInt('ESS_CYCLE_DELAY', 10, 0) * 1000,

    /**
     * How many seconds to wait before reconnecting
     */
    longCycleDelay: e.getInt('ESS_LONG_CYCLE_DELAY', 10, 15 * 60) * 1000,

    /**
     * How many seconds to wait before reconnecting
     */
    longCycleInterval: e.getInt('ESS_LONG_CYCLE_INTERVAL', 10, 14),

    /**
     * List of worlds to subscribe to delimited by commas
     */
    worlds: e.getSplit('ESS_SUBSCRIPTION_WORLDS', ['all']),

    /**
     * List of events to subscribe to delimited by commas
     */
    events: e.getSplit('ESS_SUBSCRIPTION_EVENTS', ['all']),

    /**
     * Sets the logicalAndCharactersWithWorlds in subscription
     */
    logicalAnd: e.getBool('ESS_SUBSCRIPTION_LOGICAL_AND', true),

    /**
     * The interval used for resending interval
     */
    subscriptionInterval: e.getInt('ESS_SUBSCRIPTION_INTERVAL', 10, 60) * 1000,

    /**
     * The timeout when not receiving a reply, should be larger then interval
     */
    subscriptionTimeout: e.getInt('ESS_SUBSCRIPTION_TIMEOUT', 10, 180) * 1000,
  },
}));
