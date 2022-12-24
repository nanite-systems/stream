import { Module, OnModuleInit } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DbConfig } from './db.config';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule } from '@nanite-systems/utils';

@Module({
  imports: [ConfigModule.forFeature([DbConfig]), MikroOrmModule.forRoot()],
  exports: [MikroOrmModule],
})
export class DbModule implements OnModuleInit {
  constructor(
    private readonly orm: MikroORM,
    private readonly config: DbConfig,
  ) {}

  async onModuleInit(): Promise<void> {
    // if (this.config.autoMigrate)
    // await this.orm.schema.createSchema();
  }
}
