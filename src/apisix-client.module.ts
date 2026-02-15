import { DynamicModule, Module } from '@nestjs/common';
import { ApisixClient } from './apisix-client';
import { HttpModule } from '@nestjs/axios';
import { ConsumerScope } from './scope/consumer.scope';
import { RouteScope } from './scope/route.scope';

export interface ApisixClientConfig {
  url: string;
  adminSecret: string;
  port?: number;
  prefix?: string;
  global?: boolean;
}

@Module({})
export class ApisixClientModule {
  static forRoot(config: ApisixClientConfig): DynamicModule {
    const prefix = config.prefix ? config.prefix.replace(/\/?$/, '') : 'apisix';
    const port = config.port ? config.port : 9180;
    return {
      global: config.global ?? true,
      module: ApisixClientModule,
      imports: [
        HttpModule.register({
          baseURL: `${config.url}:${port.toString()}/${prefix}/admin`,
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': config.adminSecret,
          },
        }),
      ],
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
