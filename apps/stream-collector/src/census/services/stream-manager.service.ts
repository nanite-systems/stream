import { Logger } from '@nestjs/common';
import { Stream } from 'ps2census';
import { EssConfig } from '../config/ess.config';
import { SubscriptionConfig } from '../config/subscription.config';
import { StreamClosedException } from 'ps2census/dist/stream';

export class StreamManagerService {
  private active = false;

  private reconnectTimeout?: NodeJS.Timeout;

  private reconnectListener?: () => void;

  private subscribeInterval?: NodeJS.Timer;

  constructor(
    readonly stream: Stream.Client,
    private readonly logger: Logger,
    private readonly config: EssConfig,
    private readonly subscription: SubscriptionConfig,
  ) {
    this.prepare();
  }

  private prepare() {
    this.stream
      .on('ready', async () => {
        if (this.config.debug) this.logger.debug('Ready');

        this.startSubscribing();
      })
      .on('close', () => {
        if (this.config.debug) this.logger.debug(`Closed`);

        this.stopSubscribing();
      })
      .on('debug', this.logger.verbose, this.logger)
      .on('warn', this.logger.warn, this.logger)
      .on('error', this.logger.error, this.logger);
  }

  async start(): Promise<void> {
    if (this.active) return;
    this.active = true;

    this.enableReconnect();
    await this.connect();
  }

  private async connect(): Promise<void> {
    do {
      try {
        if (this.active) await this.stream.connect();
        return;
      } catch {}
    } while (true);
  }

  cycle(): void {
    this.logger.debug(`Cycling`);
    this.stream.destroy();
  }

  destroy(): void {
    if (!this.active) return;
    this.active = false;

    this.disableReconnect();
    this.cancelReconnect();

    this.stream.destroy();
  }

  private enableReconnect(): void {
    this.reconnectListener = () => {
      this.reconnectTimeout = setTimeout(() => {
        if (this.config.debug) this.logger.log(`Reconnecting`);

        void this.connect();
      }, this.config.reconnectDelay);
    };
    this.stream.on('close', this.reconnectListener);
  }

  private disableReconnect(): void {
    this.stream.off('close', this.reconnectListener);
    delete this.reconnectListener;
  }

  private cancelReconnect(): void {
    clearTimeout(this.reconnectTimeout);
    delete this.reconnectTimeout;
  }

  private startSubscribing(): void {
    this.subscribe();

    this.subscribeInterval = setInterval(() => {
      this.subscribe();
    }, this.config.subscriptionInterval);
  }

  private stopSubscribing(): void {
    clearInterval(this.subscribeInterval);
    delete this.subscribeInterval;
  }

  private async subscribe(): Promise<void> {
    try {
      this.stream.send({
        service: 'event',
        action: 'subscribe',
        characters: ['all'],
        worlds: this.subscription.worlds,
        eventNames: this.subscription.events,
        logicalAndCharactersWithWorlds: this.subscription.logicalAnd,
      });
    } catch (err) {
      if (err instanceof StreamClosedException) return;
      else throw err;
    }
  }
}
