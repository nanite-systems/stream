import { Controller, Get, Headers, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { FastifyReply } from 'fastify';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('auth')
  async authenticate(
    @Res() response: FastifyReply,
    @Headers('X-Forwarded-Uri') url?: string,
  ): Promise<void> {
    const serviceId = this.extractServiceId(url);

    if (serviceId && this.auth.validateServiceId(serviceId)) {
      const check = await this.auth.checkServiceId(serviceId);

      if (check.valid) {
        response.code(HttpStatus.OK).header('X-Auth-Token', check.token).send();
        return;
      }
    }

    response.code(HttpStatus.FORBIDDEN).send('403 Forbidden');
  }

  private extractServiceId(url?: string): string {
    const i = url?.indexOf('?');
    if (!i || i < 0) return null;

    const params = new URLSearchParams(url.slice(i));

    return params.get('service-id');
  }
}
