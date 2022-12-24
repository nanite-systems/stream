import { Options, ReflectMetadataProvider } from '@mikro-orm/core';

const config: Options = {
  type: 'postgresql',

  host: process.env.DB_HOST ?? 'localhost',
  port: Number.parseInt(process.env.DB_PORT, 10) ?? 5432,
  user: process.env.DB_USER ?? 'nanite',
  password: process.env.DB_PASS ?? 'pass',
  dbName: process.env.DB_NAME ?? 'nanite',

  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  migrations: {
    path: './dist/db/migrations',
    pathTs: './src/db/migrations',
  },
  metadataProvider: ReflectMetadataProvider,
  discovery: {
    warnWhenNoEntities: false,
  },
};

export default config;
