import { Module } from '@nestjs/common';
import { StreamFactory } from './factories/stream.factory';
import { STREAM_PC, STREAM_PS4EU, STREAM_PS4US } from './constants';

@Module({
  providers: [
    StreamFactory,

    {
      provide: STREAM_PC,
      useFactory: (factory: StreamFactory) => factory.createStream('ps2'),
      inject: [StreamFactory],
    },
    {
      provide: STREAM_PS4EU,
      useFactory: (factory: StreamFactory) => factory.createStream('ps2ps4eu'),
      inject: [StreamFactory],
    },
    {
      provide: STREAM_PS4US,
      useFactory: (factory: StreamFactory) => factory.createStream('ps2ps4us'),
      inject: [StreamFactory],
    },
  ],
  exports: [STREAM_PC, STREAM_PS4EU, STREAM_PS4US],
})
export class CensusModule {}
