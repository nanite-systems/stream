import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Counter } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Environment } from '../../environments/utils/environment';

@Injectable({ scope: Scope.REQUEST })
export class CommandCountInterceptor implements NestInterceptor {
  constructor(
    private readonly environment: Environment,
    @InjectMetric('nss_command_count')
    private readonly commandCounter: Counter,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const wsCtx = context.switchToWs();
    const data = wsCtx.getData();

    if ('action' in data)
      this.commandCounter.inc({
        command: data.action,
        environment: this.environment.name,
      });

    return next.handle();
  }
}
