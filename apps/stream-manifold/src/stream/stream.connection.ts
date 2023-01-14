import {
  Inject,
  Injectable,
  Logger,
  Scope,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { EventMessage } from './concers/message.types';
import { HELP_EVENT_MESSAGE } from './messages/help-event.message';
import { WebSocket } from 'ws';
import { SubscribeDto } from './dtos/subscribe.dto';
import { ClearSubscribeDto } from './dtos/clear-subscribe.dto';
import { first, fromEvent, map, Observable, share, takeUntil } from 'rxjs';
import { CENSUS_STREAM } from './constants';
import { ConnectionContract } from './concers/connection.contract';
import { EchoDto } from './dtos/echo.dto';
import { IgnoreErrorInterceptor } from './interceptors/ignore-error.interceptor';
import { IncomingMessage } from 'http';
import { randomUUID } from 'crypto';
import { Environment } from '../environments/utils/environment';
import { EventSubscriptionQuery } from '../subscription/entity/event-subscription.query';
import { Stream } from 'ps2census';
import { StreamConfig } from './stream.config';
import { NSS_COMMANDS } from '@nss/rabbitmq';

@Injectable({ scope: Scope.REQUEST })
@UsePipes(
  new ValidationPipe({
    transform: true,
  }),
)
@UseInterceptors(new IgnoreErrorInterceptor())
export class StreamConnection implements ConnectionContract {
  private static readonly logger = new Logger('StreamConnection');

  private readonly id = randomUUID();

  constructor(
    private readonly config: StreamConfig,
    private readonly subscription: EventSubscriptionQuery,
    private readonly environment: Environment,
    @Inject(CENSUS_STREAM) private readonly stream: Observable<any>,
  ) {}

  onConnected(client: WebSocket, request: IncomingMessage): void {
    StreamConnection.logger.log(
      `Client connected ${this.id}: ${JSON.stringify({
        environment: this.environment.name,
        headers: Object.fromEntries(
          this.config.logHeaders.map((header) => [
            header,
            request.headers[header],
          ]),
        ),
      })}`,
    );

    const close = fromEvent(client, 'close').pipe(first(), share());

    this.stream.pipe(takeUntil(close)).subscribe((message: any) => {
      client.send(JSON.stringify(message));
    });
  }

  onDisconnected(): void {
    this.subscription.clearAll();

    StreamConnection.logger.log(`Client disconnected ${this.id}`);
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'help',
  })
  help() {
    return HELP_EVENT_MESSAGE;
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'echo',
  })
  echo(@MessageBody() { payload }: EchoDto): unknown {
    return payload;
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'subscribe',
  })
  subscribe(
    @MessageBody() message: SubscribeDto,
  ): Stream.CensusMessages.Subscription {
    if (
      message.characters ||
      message.worlds ||
      message.eventNames ||
      message.logicalAndCharactersWithWorlds != undefined
    ) {
      StreamConnection.logger.log(
        `Client subscribe ${this.id}: ${JSON.stringify({
          eventNames: message.eventNames,
          worlds: message.worlds,
          characters: message.characters,
          logicalAndCharactersWithWorlds:
            message.logicalAndCharactersWithWorlds,
        })}`,
      );

      this.subscription.merge(message);
    }

    return this.subscription.format(message.list_characters);
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'clearSubscribe',
  })
  clearSubscribe(
    @MessageBody() message: ClearSubscribeDto,
  ): Stream.CensusMessages.Subscription {
    if (message.all) {
      StreamConnection.logger.log(`Client unsubscribe all ${this.id}`);

      this.subscription.clearAll();
    } else if (
      message.characters ||
      message.worlds ||
      message.eventNames ||
      message.logicalAndCharactersWithWorlds != undefined
    ) {
      StreamConnection.logger.log(
        `Client unsubscribe ${this.id}: ${JSON.stringify({
          eventNames: message.eventNames,
          worlds: message.worlds,
          characters: message.characters,
          logicalAndCharactersWithWorlds:
            message.logicalAndCharactersWithWorlds,
          all: message.all,
        })}`,
      );

      this.subscription.clear(message);
    }

    return this.subscription.format(message.list_characters);
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'recentCharacterIds',
  })
  recentCharacterIds(): Observable<Stream.CensusMessages.ServiceMessage> {
    return this.environment.nssClient
      .send(NSS_COMMANDS.recentCharacters, {})
      .pipe(
        map((characters) => ({
          service: 'event',
          type: 'serviceMessage',
          payload: {
            recent_character_id_count: characters.length,
            recent_character_id_list: characters,
          },
        })),
      );
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'recentCharacterIdsCount',
  })
  recentCharacterIdsCount(): Observable<Stream.CensusMessages.ServiceMessage> {
    return this.environment.nssClient
      .send(NSS_COMMANDS.recentCharacterCount, {})
      .pipe(
        map((recent_character_id_count) => ({
          service: 'event',
          type: 'serviceMessage',
          payload: {
            recent_character_id_count,
          },
        })),
      );
  }
}
