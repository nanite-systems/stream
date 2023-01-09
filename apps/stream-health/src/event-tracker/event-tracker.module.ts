import { CacheModule, Module } from '@nestjs/common';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { DbModule } from '../db/db.module';
import { EventTrackerConfig } from './event-tracker.config';
import { EventTrackerService } from './services/event-tracker.service';
import { EventTrackerController } from './controllers/event-tracker.controller';
import { ConfigModule } from '@nss/utils';

@Module({
  imports: [
    ConfigModule.forFeature([EventTrackerConfig]),
    DbModule,
    RabbitMqModule,
    CacheModule.register({
      ttl: 60000,
      max: 1000,
    }),
  ],
  providers: [EventTrackerConfig, EventTrackerService],
  controllers: [EventTrackerController],
})
export class EventTrackerModule {}
