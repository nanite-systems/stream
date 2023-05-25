import { env, envBool, envInt, envSplit } from '@nss/utils';
import { randomUUID } from 'crypto';

export const config = () => ({
  app: {
    /**
     * Port the app is exposed on
     */
    port: env('APP_PORT', '3000'),

    /**
     * Unique id given to this application
     */
    id: env('APP_ID', randomUUID()),
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
     * Exchange that is used for duplicate messages
     */
    duplicateExchangeName: env('RMQ_DUPLICATE_EXCHANGE_NAME', 'nss.duplicates'),
  },

  ess: {
    /**
     * Census Service ID for authentication
     */
    serviceId: env('ESS_SERVICE_ID'),

    /**
     * The environment to collect from
     */
    environment: env('ESS_ENVIRONMENT'),

    /**
     * The heartbeat interval
     */
    heartbeatInterval: envInt('ESS_HEARTBEAT_INTERVAL', 10, 30) * 1000,

    /**
     * How many connection to run
     */
    replication: envInt('ESS_CONNECTION_REPLICATION', 10, 4),

    /**
     * How many seconds to wait before reconnecting
     */
    reconnectDelay: envInt('ESS_RECONNECT_DELAY', 10, 5) * 1000,

    /**
     * How many seconds to wait before reconnecting
     */
    cycleDelay: envInt('ESS_CYCLE_DELAY', 10, 0) * 1000,

    /**
     * How many seconds to wait before reconnecting
     */
    longCycleDelay: envInt('ESS_LONG_CYCLE_DELAY', 10, 15 * 60) * 1000,

    /**
     * How many seconds to wait before reconnecting
     */
    longCycleInterval: envInt('ESS_LONG_CYCLE_INTERVAL', 10, 14),

    /**
     * The minimum absolute difference that heartbeats of connections should have
     */
    minAcceptedOffsetThreshold: envInt('ESS_MIN_OFFSET_THRESHOLD', 10, 600),

    /**
     * List of worlds to subscribe to delimited by commas
     */
    worlds: envSplit('ESS_SUBSCRIPTION_WORLDS', ['all']),

    /**
     * List of events to subscribe to delimited by commas
     */
    events: envSplit('ESS_SUBSCRIPTION_EVENTS', ['all']),

    /**
     * Sets the logicalAndCharactersWithWorlds in subscription
     */
    logicalAnd: envBool('ESS_SUBSCRIPTION_LOGICAL_AND', true),

    /**
     * The interval used for resending interval
     */
    subscriptionInterval: envInt('ESS_SUBSCRIPTION_INTERVAL', 10, 60) * 1000,
  },
});
