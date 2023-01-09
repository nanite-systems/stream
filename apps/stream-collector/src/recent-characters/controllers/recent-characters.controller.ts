import { Controller } from '@nestjs/common';
import { RecentCharacterService } from '../services/recent-character.service';
import { MessagePattern } from '@nestjs/microservices';
import { NSS_COMMANDS, NssCommandResponses } from '@nss/rabbitmq';

@Controller()
export class RecentCharactersController {
  constructor(private readonly service: RecentCharacterService) {}

  @MessagePattern(NSS_COMMANDS.recentCharacters)
  recentCharacters(): Promise<NssCommandResponses.RecentCharactersRes> {
    return this.service.recentCharacters();
  }

  @MessagePattern(NSS_COMMANDS.recentCharacterCount)
  recentCharacterCount(): Promise<NssCommandResponses.RecentCharacterCountRes> {
    return this.service.recentCharacterCount();
  }
}
