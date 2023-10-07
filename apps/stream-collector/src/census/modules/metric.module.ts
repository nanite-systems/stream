import { Module } from '@nestjs/common';
import {
  getToken,
  makeCounterProvider,
  makeGaugeProvider,
  makeSummaryProvider,
} from '@willsoto/nestjs-prometheus';
import {
  essConnectionClockOffsetSeconds,
  essConnectionHeartbeatOffsetSeconds,
  essConnectionReadyLatencySeconds,
  essConnectionStartTimeSeconds,
  essConnectionStateCount,
  essConnectionStateTotal,
  essSubscriptionAlterationCount,
  essSubscriptionMessageLatencySeconds,
  essSubscriptionMessageTimeoutCount,
} from '../../metrics';

@Module({
  providers: [
    makeGaugeProvider({
      name: essConnectionStartTimeSeconds,
      help: 'Start time of ess connection unix epoch',
      labelNames: ['connection'],
    }),
    makeSummaryProvider({
      name: essConnectionReadyLatencySeconds,
      help: 'Latency in seconds of between connecting and connection being ready',
      labelNames: ['connection'],
    }),
    makeGaugeProvider({
      name: essConnectionHeartbeatOffsetSeconds,
      help: 'Residual of unix epoch divided by heartbeat interval',
      labelNames: ['connection'],
    }),
    makeCounterProvider({
      name: essConnectionStateCount,
      help: 'Counter that tracks disconnects',
      labelNames: ['connection', 'type'],
    }),
    makeGaugeProvider({
      name: essConnectionStateTotal,
      help: 'Current number of connections in a certain state',
      labelNames: ['type'],
    }),

    makeCounterProvider({
      name: essSubscriptionAlterationCount,
      help: 'Counter that tracks how many times a subscription to a connection has been altered',
      labelNames: ['connection', 'key'],
    }),
    makeCounterProvider({
      name: essSubscriptionMessageTimeoutCount,
      help: 'Counter that tracks timeouts of subscription messages',
      labelNames: ['connection'],
    }),
    makeSummaryProvider({
      name: essSubscriptionMessageLatencySeconds,
      help: 'Latency in seconds sending a subscription and receiving a response',
      labelNames: ['connection', 'key'],
    }),

    makeGaugeProvider({
      name: essConnectionClockOffsetSeconds,
      help: 'Clock offset between ess and system',
      labelNames: ['connection'],
    }),
  ],
  exports: [
    essConnectionClockOffsetSeconds,
    essConnectionHeartbeatOffsetSeconds,
    essConnectionReadyLatencySeconds,
    essConnectionStartTimeSeconds,
    essConnectionStateCount,
    essConnectionStateTotal,
    essSubscriptionAlterationCount,
    essSubscriptionMessageLatencySeconds,
    essSubscriptionMessageTimeoutCount,
  ].map(getToken),
})
export class MetricModule {}
