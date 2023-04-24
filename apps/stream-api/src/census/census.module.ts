import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { StreamFactory } from './factories/stream.factory';
import { STREAM_PC, STREAM_PS4EU, STREAM_PS4US } from './constants';
import { CensusClient } from 'ps2census';

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
export class CensusModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(STREAM_PC) private readonly streamPc: CensusClient,
    @Inject(STREAM_PS4EU) private readonly streamPs4eu: CensusClient,
    @Inject(STREAM_PS4US) private readonly streamPs4us: CensusClient,
  ) {}

  async onModuleInit(): Promise<void> {
    await Promise.all([
      this.streamPc.watch(),
      this.streamPs4eu.watch(),
      this.streamPs4us.watch(),
    ]);
  }

  onModuleDestroy(): void {
    this.streamPc.destroy();
    this.streamPs4eu.destroy();
    this.streamPs4us.destroy();
  }
}
