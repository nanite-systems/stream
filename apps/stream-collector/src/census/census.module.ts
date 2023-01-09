import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nss/utils';
import { EssConfig } from './config/ess.config';
import { SubscriptionConfig } from './config/subscription.config';
import { StreamConductorService } from './services/stream-conductor.service';
import { StreamFactory } from './factories/stream.factory';
import { IdBroker } from './utils/id.broker';
import { MANAGED_STREAMS, STREAMS } from './constants';
import { StreamIndicator } from './indicators/stream.indicator';
import { StreamManagerService } from './services/stream-manager.service';

const range = (n: number) => Array.from(Array(n).keys());

@Module({
  imports: [ConfigModule.forFeature([EssConfig, SubscriptionConfig])],
  providers: [
    IdBroker,
    StreamFactory,
    StreamConductorService,
    StreamIndicator,

    {
      provide: MANAGED_STREAMS,
      useFactory: (config: EssConfig, factory: StreamFactory) =>
        Object.freeze(
          range(config.replication).map(() => factory.createManagedStream()),
        ),
      inject: [EssConfig, StreamFactory],
    },
    {
      provide: STREAMS,
      scope: Scope.TRANSIENT,
      useFactory: (connections: StreamManagerService[]) =>
        connections.map((c) => c.stream),
      inject: [MANAGED_STREAMS],
    },
  ],
  exports: [STREAMS, StreamIndicator],
})
export class CensusModule {}
