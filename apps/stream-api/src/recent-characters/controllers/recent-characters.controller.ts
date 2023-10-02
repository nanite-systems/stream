import { Controller, ParseEnumPipe, UseInterceptors } from '@nestjs/common';
import { RecentCharacterService } from '../services/recent-character.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiCommands,
  Environments,
  RecentCharacterCountResponse,
  RecentCharactersResponse,
} from '@nss/ess-concerns';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller()
@UseInterceptors(CacheInterceptor)
@CacheTTL(30 * 1000)
export class RecentCharactersController {
  constructor(private readonly service: RecentCharacterService) {}

  @MessagePattern(ApiCommands.recentCharacters)
  @CacheKey('recent_characters')
  recentCharacters(
    @Payload('environment', new ParseEnumPipe(Environments))
    environment: Environments,
  ): Promise<RecentCharactersResponse> {
    return this.service.recentCharacters(environment);
  }

  @MessagePattern(ApiCommands.recentCharacterCount)
  @CacheKey('recent_character_count')
  recentCharacterCount(
    @Payload('environment', new ParseEnumPipe(Environments))
    environment: Environments,
  ): Promise<RecentCharacterCountResponse> {
    return this.service.recentCharacterCount(environment);
  }
}
