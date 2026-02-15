import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  BasicAuthConsumerPlugin,
  ApisixRoutePlugins,
  JweDecryptConsumerPlugin,
  JwtAuthConsumerPlugin,
  KeyAuthConsumerPlugin,
  KeyAuthRoutePlugin,
} from '../src';
import { ApisixClient, ApisixClientModule } from '../src';

describe('ApisixClient', () => {
  let app: INestApplication;
  let apisixClient: ApisixClient;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ApisixClientModule.forRoot({
          url: 'http://localhost:9180',
          adminSecret: '123',
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    apisixClient = module.get(ApisixClient);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ConsumerScope', () => {
    const username = 'e2e-test-consumer';

    beforeEach(async () => {
      try {
        await apisixClient.consumer().deleteConsumer(username);
      } catch (_) {}
    });

    it('should create consumer with key-auth plugin', async () => {
      await apisixClient.consumer().upsertConsumer({
        username,
        plugins: {
          'key-auth': { key: 'e2e-secret-key' },
        },
      });

      const consumer = await apisixClient
        .consumer()
        .getConsumer<{ 'key-auth': KeyAuthConsumerPlugin }>(username);

      expect(consumer).toBeDefined();
      expect(consumer.value.plugins).toBeDefined();
      expect(consumer.value.plugins!['key-auth']).toBeDefined();
      expect(consumer.value.plugins!['key-auth']!.key).toBe('e2e-secret-key');
    });

    it('should create consumer with basic-auth plugin', async () => {
      await apisixClient.consumer().upsertConsumer({
        username,
        plugins: {
          'basic-auth': { username: 'u1', password: 'p1' },
        },
      });

      const consumer = await apisixClient
        .consumer()
        .getConsumer<{ 'basic-auth': BasicAuthConsumerPlugin }>(username);

      expect(consumer.value.plugins!['basic-auth']).toBeDefined();
      expect(consumer.value.plugins!['basic-auth']!.username).toBe('u1');
      expect(consumer.value.plugins!['basic-auth']!.password).toBe('p1');
    });

    it('should create consumer with jwt-auth plugin (HS256)', async () => {
      await apisixClient.consumer().upsertConsumer({
        username,
        plugins: {
          'jwt-auth': {
            key: 'jwt-key-1',
            algorithm: 'HS256',
            secret: 'jwt-secret-1',
            exp: 3600,
          },
        },
      });

      const consumer = await apisixClient
        .consumer()
        .getConsumer<{ 'jwt-auth': JwtAuthConsumerPlugin }>(username);

      const jwt = consumer.value.plugins!['jwt-auth'];
      expect(jwt).toBeDefined();
      expect(jwt!.key).toBe('jwt-key-1');
      expect(jwt!.algorithm).toBe('HS256');
      expect(jwt!.exp).toBe(3600);
      expect(jwt!.secret).toBe('jwt-secret-1');
    });

    it('should create consumer with jwe-decrypt plugin', async () => {
      await apisixClient.consumer().upsertConsumer({
        username,
        plugins: {
          'jwe-decrypt': {
            key: 'jwe-key-1',
            secret: '12345678901234567890123456789012',
            is_base64_encoded: false,
          },
        },
      });

      const consumer = await apisixClient
        .consumer()
        .getConsumer<{ 'jwe-decrypt': JweDecryptConsumerPlugin }>(username);

      expect(consumer.value.plugins!['jwe-decrypt']).toBeDefined();
      expect(consumer.value.plugins!['jwe-decrypt']!.key).toBe('jwe-key-1');
      expect(consumer.value.plugins!['jwe-decrypt']!.secret).toBe(
        '12345678901234567890123456789012',
      );
      expect(consumer.value.plugins!['jwe-decrypt']!.is_base64_encoded).toBe(
        false,
      );
    });

    it('should update existing consumer plugins (upsert)', async () => {
      await apisixClient.consumer().upsertConsumer({
        username,
        plugins: {
          'key-auth': { key: 'v1' },
        },
      });

      await apisixClient.consumer().upsertConsumer({
        username,
        plugins: {
          'key-auth': { key: 'v2' },
        },
      });

      const consumer = await apisixClient
        .consumer()
        .getConsumer<{ 'key-auth': KeyAuthConsumerPlugin }>(username);

      expect(consumer.value.plugins!['key-auth']!.key).toBe('v2');
    });

    it('should delete consumer', async () => {
      await apisixClient.consumer().upsertConsumer({
        username,
        plugins: { 'key-auth': { key: 'to-delete' } },
      });

      await apisixClient.consumer().deleteConsumer(username);

      await expect(
        apisixClient.consumer().getConsumer(username),
      ).rejects.toBeDefined();
    });
  });

  describe('RouteScope', () => {
    const routeId = 'e2e-test-route';

    const baseRoute = {
      uri: '/e2e/route/*',
      upstream: {
        nodes: {
          'httpbin.org:80': 1,
        },
      },
    };

    beforeEach(async () => {
      try {
        await apisixClient.route().deleteRoute(routeId);
      } catch (_) {}
    });

    type RoutePluginCase = {
      name: keyof ApisixRoutePlugins;
      config: NonNullable<ApisixRoutePlugins[keyof ApisixRoutePlugins]>;
      assert: (plugins: Record<string, any>) => void;
    };

    const pluginCases: RoutePluginCase[] = [
      {
        name: 'key-auth',
        config: { header: 'x-api-key' },
        assert: (plugins) => {
          expect(plugins['key-auth']?.header).toBe('x-api-key');
        },
      },
      {
        name: 'basic-auth',
        config: { hide_credentials: true },
        assert: (plugins) => {
          expect(plugins['basic-auth']?.hide_credentials).toBe(true);
        },
      },
      {
        name: 'jwt-auth',
        config: { header: 'x-jwt-token', query: 'jwt', hide_credentials: true },
        assert: (plugins) => {
          expect(plugins['jwt-auth']?.header).toBe('x-jwt-token');
          expect(plugins['jwt-auth']?.query).toBe('jwt');
          expect(plugins['jwt-auth']?.hide_credentials).toBe(true);
        },
      },
      {
        name: 'jwe-decrypt',
        config: {
          header: 'x-jwe-header',
          forward_header: 'x-forwarded-jwe',
          strict: true,
        },
        assert: (plugins) => {
          expect(plugins['jwe-decrypt']?.header).toBe('x-jwe-header');
          expect(plugins['jwe-decrypt']?.forward_header).toBe(
            'x-forwarded-jwe',
          );
          expect(plugins['jwe-decrypt']?.strict).toBe(true);
        },
      },
      {
        name: 'openid-connect',
        config: {
          client_id: 'e2e-client',
          client_secret: 'e2e-secret',
          discovery: 'https://example.com/.well-known/openid-configuration',
        },
        assert: (plugins) => {
          expect(plugins['openid-connect']?.client_id).toBe('e2e-client');
          expect(plugins['openid-connect']?.client_secret).toBe('e2e-secret');
          expect(plugins['openid-connect']?.discovery).toBe(
            'https://example.com/.well-known/openid-configuration',
          );
        },
      },
      {
        name: 'response-rewrite',
        config: {
          status_code: 201,
          body: 'ok',
          headers: { set: { 'x-test': '1' } },
        },
        assert: (plugins) => {
          expect(plugins['response-rewrite']?.status_code).toBe(201);
          expect(plugins['response-rewrite']?.body).toBe('ok');
          expect(plugins['response-rewrite']?.headers?.set?.['x-test']).toBe(
            '1',
          );
        },
      },
      {
        name: 'proxy-rewrite',
        config: {
          uri: '/rewritten',
          host: 'example.com',
          headers: { add: { 'x-proxy': '1' } },
        },
        assert: (plugins) => {
          expect(plugins['proxy-rewrite']?.uri).toBe('/rewritten');
          expect(plugins['proxy-rewrite']?.host).toBe('example.com');
          expect(plugins['proxy-rewrite']?.headers?.add?.['x-proxy']).toBe('1');
        },
      },
      {
        name: 'grpc-transcode',
        config: {
          proto_id: '1',
          service: 'helloworld.Greeter',
          method: 'SayHello',
        },
        assert: (plugins) => {
          expect(plugins['grpc-transcode']?.proto_id).toBe('1');
          expect(plugins['grpc-transcode']?.service).toBe('helloworld.Greeter');
          expect(plugins['grpc-transcode']?.method).toBe('SayHello');
        },
      },
      {
        name: 'grpc-web',
        config: {},
        assert: (plugins) => {
          expect(plugins['grpc-web']).toBeDefined();
        },
      },
      {
        name: 'fault-injection',
        config: { delay: { duration: 2000, percentage: 50 } },
        assert: (plugins) => {
          expect(plugins['fault-injection']?.delay?.duration).toBe(2000);
          expect(plugins['fault-injection']?.delay?.percentage).toBe(50);
        },
      },
      {
        name: 'mocking',
        config: { response_example: '{"ok":true}', delay: 10 },
        assert: (plugins) => {
          expect(plugins['mocking']?.response_example).toBe('{"ok":true}');
          expect(plugins['mocking']?.delay).toBe(10);
        },
      },
      {
        name: 'degraphql',
        config: { query: 'query { hello }' },
        assert: (plugins) => {
          expect(plugins['degraphql']?.query).toBe('query { hello }');
        },
      },
      {
        name: 'body-transformer',
        config: {
          request: { input_format: 'json', template: '{"hello":"{{name}}"}' },
        },
        assert: (plugins) => {
          expect(plugins['body-transformer']?.request?.input_format).toBe(
            'json',
          );
          expect(plugins['body-transformer']?.request?.template).toBe(
            '{"hello":"{{name}}"}',
          );
        },
      },
      {
        name: 'attach-consumer-label',
        config: { headers: { 'x-consumer': '$consumer_name' } },
        assert: (plugins) => {
          expect(
            plugins['attach-consumer-label']?.headers?.['x-consumer'],
          ).toBe('$consumer_name');
        },
      },
      {
        name: 'cors',
        config: { allow_origins: '*', allow_methods: 'GET' },
        assert: (plugins) => {
          expect(plugins['cors']?.allow_origins).toBe('*');
          expect(plugins['cors']?.allow_methods).toBe('GET');
        },
      },
      {
        name: 'ip-restriction',
        config: { whitelist: ['127.0.0.1'] },
        assert: (plugins) => {
          expect(plugins['ip-restriction']?.whitelist).toEqual(['127.0.0.1']);
        },
      },
      {
        name: 'redirect',
        config: { uri: '/redirected', ret_code: 301 },
        assert: (plugins) => {
          expect(plugins['redirect']?.uri).toBe('/redirected');
          expect(plugins['redirect']?.ret_code).toBe(301);
        },
      },
      {
        name: 'echo',
        config: { body: 'ok', status_code: 200, headers: { 'x-echo': '1' } },
        assert: (plugins) => {
          expect(plugins['echo']?.body).toBe('ok');
          expect(plugins['echo']?.status_code).toBe(200);
          expect(plugins['echo']?.headers?.['x-echo']).toBe('1');
        },
      },
    ];

    it.each(pluginCases)(
      'should create route with $name plugin',
      async (pluginCase) => {
        await apisixClient.route().upsertRoute(routeId, {
          ...baseRoute,
          plugins: {
            [pluginCase.name]: pluginCase.config,
          },
        });

        const route = (await apisixClient.route().getRoute(routeId)) as {
          value: { plugins?: Record<string, any> };
        };

        const plugins = route.value.plugins ?? {};
        expect(plugins[pluginCase.name]).toBeDefined();
        pluginCase.assert(plugins);
      },
    );

    it('should update existing route plugins (upsert)', async () => {
      await apisixClient.route().upsertRoute(routeId, {
        ...baseRoute,
        plugins: {
          'key-auth': { header: 'v1' },
        },
      });

      await apisixClient.route().upsertRoute(routeId, {
        ...baseRoute,
        plugins: {
          'key-auth': { header: 'v2' },
        },
      });

      const route = (await apisixClient.route().getRoute(routeId)) as {
        value: { plugins?: { 'key-auth'?: KeyAuthRoutePlugin } };
      };

      expect(route.value.plugins!['key-auth']!.header).toBe('v2');
    });

    it('should delete route', async () => {
      await apisixClient.route().upsertRoute(routeId, {
        ...baseRoute,
        plugins: {
          'key-auth': { header: 'to-delete' },
        },
      });

      await apisixClient.route().deleteRoute(routeId);

      await expect(
        apisixClient.route().getRoute(routeId),
      ).rejects.toBeDefined();
    });
  });
});
