import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { STREAMS } from '../../census/constants';
import { Stream } from 'ps2census';
import { MultiplexerService } from '../../multiplexer/services/multiplexer.service';
import { ServiceTrackerService } from '../../service-tracker/services/service-tracker.service';

@Injectable()
export class IngressService implements OnModuleInit {
  constructor(
    @Inject(STREAMS) private readonly streams: Stream.Client[],
    private readonly multiplexer: MultiplexerService,
    private readonly worldTracker: ServiceTrackerService,
  ) {}

  onModuleInit(): void {
    for (const id in this.streams)
      this.streams[id].on('message', (message) => {
        if (message.service === 'event') {
          switch (message.type) {
            case 'serviceStateChanged':
              this.worldTracker.handleState(message);
              break;
            case 'serviceMessage':
              this.handleServiceMessage(message, id);
              break;
          }
        }
      });
  }

  private handleServiceMessage(
    message: Stream.CensusMessages.ServiceMessage,
    id: string,
  ): void {
    if ('event_name' in message.payload)
      this.multiplexer.handleEvent(message.payload, id);
  }
}
