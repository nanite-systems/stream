import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ServiceTrackerService } from '../services/service-tracker.service';
import { ApiCommands, ServiceStatesResponse } from '@nss/ess-concerns';

@Controller()
export class ServiceStateController {
  constructor(private readonly serviceTracker: ServiceTrackerService) {}

  @MessagePattern(ApiCommands.serviceStates)
  serviceStates(): ServiceStatesResponse {
    return this.serviceTracker.getStates();
  }
}
