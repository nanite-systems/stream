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
import { NssApiService } from '../nss-api/services/nss-api.service';

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
    private readonly subscription: EventSubscriptionQuery,
    private readonly environment: Environment,
    private readonly api: NssApiService,
    @Inject(CENSUS_STREAM) private readonly stream: Observable<any>,
  ) {}

  onConnected(client: WebSocket, request: IncomingMessage): void {
    StreamConnection.logger.debug(
      `Client connected ${this.id}: ${JSON.stringify({
        environment: this.environment.name,
        headers: request.rawHeaders,
      })}`,
    );

    this.subscribeFromParams(request);

    const close = fromEvent(client, 'close').pipe(first(), share());

    this.stream.pipe(takeUntil(close)).subscribe((message: any) => {
      client.send(JSON.stringify(message));
    });
  }

  onDisconnected(): void {
    this.subscription.clearAll();

    StreamConnection.logger.debug(`Client disconnected ${this.id}`);
  }

  private subscribeFromParams(request: IncomingMessage): void {
    const { searchParams } = new URL(
      request.url,
      `http://${request.headers.host}`,
    );

    this.subscription.merge({
      eventNames: searchParams
        .getAll('event_names')
        .flatMap((v) => v.split(',')),
      characters: searchParams
        .getAll('characters')
        .flatMap((v) => v.split(',')),
      worlds: searchParams.getAll('worlds').flatMap((v) => v.split(',')),
      logicalAndCharactersWithWorlds: this.parseLogicalAndCharactersWithWorlds(
        searchParams.get('logical_and_characters_with_worlds'),
      ),
    });
  }

  private parseLogicalAndCharactersWithWorlds(
    param?: string,
  ): boolean | undefined {
    param = param?.toLowerCase();

    if (['1', 'true'].includes(param)) return true;
    if (['0', 'false'].includes(param)) return false;

    return undefined;
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
      StreamConnection.logger.debug(
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
      StreamConnection.logger.debug(
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
    return this.api.recentCharacters(this.environment.name).pipe(
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
    return this.api.recentCharacterCount(this.environment.name).pipe(
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
