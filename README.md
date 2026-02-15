<p align="center">
    <image src="nestjstools-logo.png" width="400">
</p>

# @nestjstools/apisix-client

A lightweight and strongly-typed NestJS module for integrating with Apache APISIX Admin API.
It allows you to manage routes, services, upstreams, consumers and plugins programmatically from your NestJS
application.
Designed for infrastructure automation, dynamic gateway configuration, and platform tooling.

---

### Features

* Simple forRoot() configuration
* Fully typed Admin API client
* Global module support
* Configurable prefix and port
* Designed for automation & platform services
* Clean NestJS integration

## Installation

This library requires `@nestjs/axios` to communicate with the APISIX Admin API.

```bash
npm install @nestjstools/apisix-client @nestjs/axios
```

or

```bash
yarn add @nestjstools/apisix-client @nestjs/axios
```

---

## Quick Start
### Register Module
```typescript
import { Module } from '@nestjs/common';
import { ApisixClientModule } from '@nestjstools/apisix-client';

@Module({
  imports: [
    ApisixClientModule.forRoot({
      url: 'http://localhost',
      adminSecret: process.env.APISIX_ADMIN_SECRET,
      global: true, // optional (default: true)
      prefix: 'apisix', // optional (default: 'apisix')
      port: 9180, // optional (default: 9180)
      // Base URL becomes:
      // http://localhost:9180/apisix
    }),
  ],
})
export class AppModule {
}

```

---

## Usage Example
### Inject Client
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ApisixClient, ApisixRouteRequest } from '@nestjstools/apisix-client';

@Injectable()
export class GatewaySyncService implements OnModuleInit {
  constructor(private readonly apisix: ApisixClient) {}

  async onModuleInit() {
    await this.ensureUserRoute();
  }

  private async ensureUserRoute() {
    const routeId = 'users-route';

    const desiredRoute = {
      id: routeId,
      uri: '/users',
      methods: ['GET', 'POST'],
      upstream: {
        type: 'roundrobin',
        nodes: {
          'host.docker.internal:3000': 1,
        },
      },
    } as ApisixRouteRequest;

    try {
      await this.apisix.route().upsertRoute(routeId, desiredRoute);
      console.log('APISIX route updated');
    } catch (err) {
      console.log(err);
    }
  }
}

```

## **Configuration**

| Property      | Description              | Default  |
|---------------|--------------------------|----------|
| `url`         | Base APISIX host         | required |
| `adminSecret` | APISIX Admin API key     | required |
| `port`        | Admin API port           | `9180`   |
| `prefix`      | Admin API prefix         | `apisix` |
| `global`      | Register module globally | `true`   |

---

This library supports most of the commonly used Apache APISIX plugins, including authentication, traffic control, transformation, and security plugins.

---

## 🧪 Tests

This library is covered by **end-to-end (E2E) tests** to ensure real integration behavior with Apache APISIX.

The E2E test suite validates:

* Route creation and updates
* Plugin configuration
* Consumer management
* Admin API communication
* Error handling scenarios

All critical gateway operations are tested against a running APISIX instance to ensure production-level reliability.
