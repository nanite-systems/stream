import { Module } from '@nestjs/common';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { MultiplexerConfig } from './multiplexer.config';
import { MULTIPLEXER_HTTP } from './constants';
import { Axios } from 'axios';
import { MultiplexerService } from './services/multiplexer.service';
import { MultiplexerIndicator } from './indicators/multiplexer.indicator';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forFeature([MultiplexerConfig]),
    TerminusModule,
    HttpModule,
  ],
  providers: [
    MultiplexerService,
    MultiplexerIndicator,

    {
      provide: MULTIPLEXER_HTTP,
      useFactory: (config: MultiplexerConfig) =>
        new Axios({
          baseURL: config.endpoint,
        }),
      inject: [MultiplexerConfig],
    },
  ],
  exports: [MultiplexerService, MultiplexerIndicator],
})
export class MultiplexerModule {}
