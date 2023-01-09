import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ServiceTrackerService } from '../services/service-tracker.service';
import { NSS_COMMANDS, NssCommandResponses } from '@nss/rabbitmq';

@Controller()
export class ServiceStateController {
  constructor(private readonly serviceTracker: ServiceTrackerService) {}

  @MessagePattern(NSS_COMMANDS.serviceStates)
  serviceStates(): NssCommandResponses.ServiceStateRes {
    return this.serviceTracker.getStates();
  }
}
