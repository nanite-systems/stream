import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Axios } from 'axios';
import { CENSUS_API } from '../constants';

@Injectable()
export class ServiceIdValidationService {
  constructor(@Inject(CENSUS_API) private readonly census: Axios) {}

  async validate(serviceId: string): Promise<boolean> {
    if (!this.validateFormat(serviceId)) return false;

    const { data, status } = await this.census.get(`/${serviceId}/get/ps2:v2/`);

    if (300 <= status && status < 400) throw new ServiceUnavailableException();

    return !('error' in JSON.parse(data));
  }

  private validateFormat(serviceId: string): boolean {
    if (!serviceId || !serviceId.startsWith('s:')) return false;

    return /^[a-z0-9]+$/i.test(serviceId.slice(2)) && serviceId != 's:example';
  }
}
