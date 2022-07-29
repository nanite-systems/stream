import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Stream } from 'ps2census';
import { CensusConfig } from '../census.config';
import { fromEvent, Subscription, takeUntil, timer } from 'rxjs';

@Injectable()
export class StreamManagerService
  implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger('StreamManagerService');

  private reconnectSubscription?: Subscription;

  private reconnectDelay: number;

  constructor(
    private readonly stream: Stream.Client,
    private readonly config: CensusConfig,
  ) {
    this.reconnectDelay = config.reconnectDelay;
  }

  onModuleInit(): void {
    const ready = fromEvent(this.stream, 'ready');
    const close = fromEvent(this.stream, 'close');

    this.stream.on('debug', (message) => this.logger.verbose(message));
    this.stream.on('warn', (message) => this.logger.warn(message));
    this.stream.on('error', (err) => this.logger.error(err));

    ready.subscribe(() => {
      this.logger.log(`Connected to Census`);

      if (this.config.reconnectInterval) {
        this.logger.verbose(`Reconnect set: ${this.config.reconnectInterval}`);

        timer(this.config.reconnectInterval)
          .pipe(takeUntil(close))
          .subscribe(() => {
            this.logger.log('Force reconnect');
            this.stream.destroy();
          });
      }

      if (this.config.resubscribeInterval)
        this.logger.verbose(
          `Resubscribe set: ${this.config.resubscribeInterval}`,
        );

      timer(0, this.config.resubscribeInterval)
        .pipe(takeUntil(close))
        .subscribe(() => {
          void this.subscribe();
        });
    });

    this.reconnectSubscription = close.subscribe(() => {
      this.logger.debug(`Reconnecting to Census`);

      setTimeout(async () => {
        try {
          await this.connect();
        } catch {}
      }, this.reconnectDelay);
    });
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log(`Connecting to Census`);

    await this.connect();
  }

  onApplicationShutdown(): void {
    this.reconnectSubscription.unsubscribe();
    this.stream.destroy();
  }

  private async connect(): Promise<void> {
    try {
      await this.stream.connect();

      this.reconnectDelay = this.config.reconnectDelay;
    } catch (err) {
      this.logger.warn(`Connection failed: ${JSON.stringify(err)}`);

      this.reconnectDelay = this.config.reconnectDelayFault;
    }
  }

  private async subscribe(): Promise<void> {
    try {
      await this.stream.send({
        service: 'event',
        action: 'subscribe',
        characters: ['all'],
        worlds: this.config.worlds,
        eventNames: this.config.events,
        logicalAndCharactersWithWorlds: this.config.logicalAnd,
      });
    } catch (err) {
      this.logger.warn(`Failed to send subscription: ${err}`);
    }
  }
}
