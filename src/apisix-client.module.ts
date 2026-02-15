import { DynamicModule, Module } from '@nestjs/common';
import { ApisixClient } from './apisix-client';
import { HttpModule } from '@nestjs/axios';
import { ConsumerScope } from './scope/consumer.scope';
import { RouteScope } from './scope/route.scope';

export interface ApisixClientConfig {
  url: string;
  adminSecret: string;
  prefix?: string;
  global?: boolean;
}

@Module({})
export class ApisixClientModule {
  static forRoot(config: ApisixClientConfig): DynamicModule {
    const prefix = config.prefix ? config.prefix.replace(/\/?$/, '') : 'apisix';
    return {
      global: config.global ?? true,
      module: ApisixClientModule,
      imports: [HttpModule.register({
        baseURL: `${config.url}/${prefix}/admin`,
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': config.adminSecret,
        },
      })],
      providers: [
        ApisixClient,
        ConsumerScope,
        RouteScope,
        {
          provide: 'APISIX_CONFIG',
          useValue: config,
        },
      ],
      exports: [ApisixClient],
    };
  }
}
