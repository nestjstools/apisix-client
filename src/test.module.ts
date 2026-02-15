import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
import { ApisixClient } from './apisix-client';
import { HttpModule } from '@nestjs/axios';
import { ConsumerScope } from './scope/consumer.scope';
import { RouteScope } from './scope/route.scope';
import { ApisixClientModule } from './apisix-client.module';

export interface ApisixClientConfig {
  url: string;
  adminSecret: string;
  global?: boolean;
}

@Module({
  imports: [
    ApisixClientModule.forRoot({
      url: 'http://localhost:9180',
      adminSecret: '123',
    })
  ]
})
export class TestModule implements OnModuleInit {
  constructor(
    private readonly apisixClient: ApisixClient,
  ) {}

  onModuleInit() {
    this.apisixClient.route().upsertRoute('test-route', {
      name: 'test-route',
      uri: '/httpbin/*',
      upstream: {
        type: 'roundrobin',
        nodes: {
          'httpbin.org:80': 1,
        },
      },
    });
  }
}
