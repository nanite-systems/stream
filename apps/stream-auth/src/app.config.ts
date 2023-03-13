import { env, envInt, envSplit } from '@nss/utils';
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
    levels: envSplit('LOG_LEVELS', ['log', 'warn', 'error']),
  },

  auth: {
    /**
     * Salt used to hash service ids
     */
    salt: env('AUTH_SALT'),

    /**
     * Time that a validated service id is cached in seconds
     */
    ttl: envInt('AUTH_EXPIRE', 10, 3 * 24 * 3600),
  },

  redis: {
    host: env('REDIS_HOST', '127.0.0.1'),

    port: envInt('REDIS_PORT', 10, 6379),

    username: env('REDIS_USER'),

    password: env('REDIS_PASS'),

    db: envInt('REDIS_DB', 10),
  },
});
