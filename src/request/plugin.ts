import {
  AuthzKeycloakRoutePlugin,
  BasicAuthConsumerPlugin,
  BasicAuthRoutePlugin,
  JweDecryptConsumerPlugin,
  JweDecryptRoutePlugin,
  JwtAuthConsumerPlugin,
  JwtAuthRoutePlugin,
  KeyAuthConsumerPlugin,
  KeyAuthRoutePlugin,
  OpenIdConnectRoutePlugin,
} from './authentication';
import {
  AttachConsumerLabelRoutePlugin,
  BodyTransformerRoutePlugin,
  DeGraphQLRoutePlugin,
  FaultInjectionRoutePlugin,
  GrpcTranscodeRoutePlugin,
  GrpcWebRoutePlugin,
  MockingRoutePlugin,
  ProxyRewriteRoutePlugin,
  ResponseRewriteRoutePlugin,
} from './transformation';
import { CorsRoutePlugin, IpRestrictionRoutePlugin } from './security';
import { EchoRoutePlugin, RedirectRoutePlugin } from './general';

export type ApisixRoutePlugins = {
  'jwt-auth'?: JwtAuthRoutePlugin;
  'key-auth'?: KeyAuthRoutePlugin;
  'jwe-decrypt'?: JweDecryptRoutePlugin;
  'basic-auth'?: BasicAuthRoutePlugin;
  'authz-keycloak'?: AuthzKeycloakRoutePlugin;
  'openid-connect'?: OpenIdConnectRoutePlugin;
  'response-rewrite'?: ResponseRewriteRoutePlugin;
  'proxy-rewrite'?: ProxyRewriteRoutePlugin;
  'grpc-transcode'?: GrpcTranscodeRoutePlugin;
  'grpc-web'?: GrpcWebRoutePlugin;
  'fault-injection'?: FaultInjectionRoutePlugin;
  mocking?: MockingRoutePlugin;
  degraphql?: DeGraphQLRoutePlugin;
  'body-transformer'?: BodyTransformerRoutePlugin;
  'attach-consumer-label'?: AttachConsumerLabelRoutePlugin;
  cors?: CorsRoutePlugin;
  'ip-restriction'?: IpRestrictionRoutePlugin;
  redirect?: RedirectRoutePlugin;
  echo?: EchoRoutePlugin;
};

export type ApisixConsumerPlugins = {
  'jwt-auth'?: JwtAuthConsumerPlugin;
  'key-auth'?: KeyAuthConsumerPlugin;
  'jwe-decrypt'?: JweDecryptConsumerPlugin;
  'basic-auth'?: BasicAuthConsumerPlugin;
};
