import { Injectable } from '@nestjs/common';
import { RouteScope } from './scope/route.scope';
import { ConsumerScope } from './scope/consumer.scope';

@Injectable()
export class ApisixClient {

  constructor(
    private readonly consumerScope: ConsumerScope,
    private readonly routeScope: RouteScope,
  ) {
  }

  consumer(): ConsumerScope {
    return this.consumerScope;
  }

  route(): RouteScope {
    return this.routeScope;
  }
}
