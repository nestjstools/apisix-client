import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  BasicAuthConsumerPlugin, JweDecryptConsumerPlugin,
  JwtAuthConsumerPlugin,
  KeyAuthConsumerPlugin,
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

    app = await module.createNestApplication();
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
      } catch (_) {
      }
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
      expect(consumer.value.plugins!['jwe-decrypt']!.is_base64_encoded).toBe(false);
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
});
