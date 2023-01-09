import { BoolTransform, ProcessEnv } from '@nss/utils';

export class DbConfig {
  @ProcessEnv('DB_AUTO_MIGRATE')
  @BoolTransform()
  readonly autoMigrate = false;
}
