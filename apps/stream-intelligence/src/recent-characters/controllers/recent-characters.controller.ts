import { Controller, ParseEnumPipe } from '@nestjs/common';
import { RecentCharacterService } from '../services/recent-character.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NSS_COMMANDS } from '@nss/rabbitmq';
import { Environment } from '../concerns/environments.enum';

@Controller()
export class RecentCharactersController {
  constructor(private readonly service: RecentCharacterService) {}

  @MessagePattern(NSS_COMMANDS.recentCharacters)
  recentCharacters(
    @Payload('environment', new ParseEnumPipe(Environment))
    environment: Environment,
  ): Promise<string[]> {
    return this.service.recentCharacters(environment);
  }

  @MessagePattern(NSS_COMMANDS.recentCharacterCount)
  recentCharacterCount(
    @Payload('environment', new ParseEnumPipe(Environment))
    environment: Environment,
  ): Promise<number> {
    return this.service.recentCharacterCount(environment);
  }
}
