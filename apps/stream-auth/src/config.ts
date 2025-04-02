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

  auth: {
    /**
     * Salt used to hash service ids
     */
    salt: e.get('AUTH_SALT'),

    /**
     * Time that a validated service id is cached in seconds
     */
    ttl: e.getInt('AUTH_TTL', 10, 3 * 24 * 3600) * 1000,
  },
}));
