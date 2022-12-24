import { BoolTransform, ProcessEnv } from '@nanite-systems/utils';

export class DbConfig {
  @ProcessEnv('DB_AUTO_MIGRATE')
  @BoolTransform()
  readonly autoMigrate = false;
}
