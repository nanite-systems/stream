import { Controller, ParseEnumPipe } from '@nestjs/common';
import { RecentCharacterService } from '../services/recent-character.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiCommands,
  RecentCharacterCountResponse,
  RecentCharactersResponse,
} from '@nss/ess-concerns';
import { Environment } from '../concerns/environments.enum';

@Controller()
export class RecentCharactersController {
  constructor(private readonly service: RecentCharacterService) {}

  @MessagePattern(ApiCommands.recentCharacters)
  recentCharacters(
    @Payload('environment', new ParseEnumPipe(Environment))
    environment: Environment,
  ): Promise<RecentCharactersResponse> {
    return this.service.recentCharacters(environment);
  }

  @MessagePattern(ApiCommands.recentCharacterCount)
  recentCharacterCount(
    @Payload('environment', new ParseEnumPipe(Environment))
    environment: Environment,
  ): Promise<RecentCharacterCountResponse> {
    return this.service.recentCharacterCount(environment);
  }
}
