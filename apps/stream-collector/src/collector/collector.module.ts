import { Module } from '@nestjs/common';
import { CensusModule } from '../census/census.module';
import { IngressService } from './services/ingress.service';
import { ServiceTrackerModule } from '../service-tracker/service-tracker.module';
import { MultiplexerModule } from '../multiplexer/multiplexer.module';

@Module({
  imports: [CensusModule, MultiplexerModule, ServiceTrackerModule],
  providers: [IngressService],
})
export class CollectorModule {}
