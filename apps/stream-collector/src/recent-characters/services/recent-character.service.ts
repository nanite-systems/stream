import { Inject, Injectable } from '@nestjs/common';
import { Stream } from 'ps2census';
import { STREAMS } from '../../census/constants';

@Injectable()
export class RecentCharacterService {
  constructor(@Inject(STREAMS) private readonly streams: Stream.Client[]) {}

  async recentCharacters(): Promise<string[]> {
    return this.request('recent_character_id_list');
  }

  async recentCharacterCount(): Promise<number> {
    return this.request('recent_character_id_count');
  }

  private request<T>(
    target: 'recent_character_id_count' | 'recent_character_id_list',
  ): Promise<T> {
    while (true) {
      try {
        return new Promise((resolve, reject) => {
          const stream = this.streams.find((stream) => stream.isReady);

          const fetchCharacters = (message: Stream.CensusMessage) => {
            if (
              message.service === 'event' &&
              message.type === 'serviceMessage' &&
              target in message.payload
            ) {
              stream.off('message', fetchCharacters).off('close', close);
              resolve(message.payload[target]);
            }
          };

          const close = () => {
            stream.off('message', fetchCharacters).off('close', close);
            reject();
          };

          stream.on('message', fetchCharacters).on('close', close);
          stream.send({ service: 'event', action: 'recentCharacterIds' });
        });
      } catch {}
    }
  }
}
