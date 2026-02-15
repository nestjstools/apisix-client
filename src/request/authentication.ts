export interface JwtAuthRoutePlugin {
  header?: string;
  query?: string;
  cookie?: string;
  hide_credentials?: boolean;
  key_claim_name?: string;
  store_in_ctx?: boolean;
}

export interface JwtAuthConsumerPlugin {
  key: string;
  secret?: string;
  public_key?: string;
  algorithm?: 'HS256' | 'HS512' | 'RS256' | 'ES256';
  exp?: number;
  base64_secret?: boolean;
  lifetime_grace_period?: number;
  key_claim_name?: string;
}

export interface KeyAuthRoutePlugin {
  header?: string;
  query?: string;
  hide_credentials?: boolean;
}

export interface KeyAuthConsumerPlugin {
  key: string;
}

export interface JweDecryptRoutePlugin {
  header: string;
  forward_header: string;
  strict?: boolean;
}

export interface JweDecryptConsumerPlugin {
  key: string;
  secret: string;
  is_base64_encoded?: boolean;
}

export interface BasicAuthRoutePlugin {
  hide_credentials?: boolean;
}

export interface BasicAuthConsumerPlugin {
  username: string;
  password: string;
}

export interface AuthzKeycloakRoutePlugin {
  discovery?: string;
  token_endpoint?: string;
  resource_registration_endpoint?: string;
  client_id: string;
  client_secret?: string;
  grant_type?: 'urn:ietf:params:oauth:grant-type:uma-ticket';
  policy_enforcement_mode?: 'ENFORCING' | 'PERMISSIVE';
  permissions?: string[];
  lazy_load_paths?: boolean;
  http_method_as_scope?: boolean;
  timeout?: number;
  access_token_expires_in?: number;
  access_token_expires_leeway?: number;
  refresh_token_expires_in?: number;
  refresh_token_expires_leeway?: number;
  ssl_verify?: boolean;
  cache_ttl_seconds?: number;
  keepalive?: boolean;
  keepalive_timeout?: number;
  keepalive_pool?: number;
  access_denied_redirect_uri?: string;
}

export interface OpenIdConnectRoutePlugin {
  client_id: string;
  client_secret: string;
  discovery: string;
  scope?: string;
  required_scopes?: string[];
  realm?: string;
  bearer_only?: boolean;
  logout_path?: string;
  post_logout_redirect_uri?: string;
  redirect_uri?: string;
  timeout?: number;
  ssl_verify?: boolean;
  introspection_endpoint?: string;
  introspection_endpoint_auth_method?:
    | 'client_secret_basic'
    | 'client_secret_post'
    | 'private_key_jwt'
    | 'client_secret_jwt';
  token_endpoint_auth_method?:
    | 'client_secret_basic'
    | 'client_secret_post'
    | 'private_key_jwt'
    | 'client_secret_jwt';
}
