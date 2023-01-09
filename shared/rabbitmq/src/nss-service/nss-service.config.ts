import { ProcessEnv } from '@nss/utils';

export class NssServiceConfig {
  @ProcessEnv('RABBITMQ_NSS_QUEUE_PREFIX')
  readonly queuePrefix = 'nss.micro.';

  @ProcessEnv('RABBITMQ_NSS_QUEUE_PS2')
  readonly queuePs2?: string;

  @ProcessEnv('RABBITMQ_NSS_QUEUE_PS2PS4EU')
  readonly queuePs2ps4eu?: string;

  @ProcessEnv('RABBITMQ_NSS_QUEUE_PS2PS4US')
  readonly queuePs2ps4us?: string;
}
