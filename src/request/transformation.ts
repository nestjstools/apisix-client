export interface ResponseRewriteRoutePlugin {
  status_code?: number;
  body?: string;
  body_base64?: boolean;
  headers?: {
    add?: string[];
    set?: Record<string, string | number | boolean>;
    remove?: string[];
  };
  vars?: Array<any[]>;
  filters?: Array<{
    regex: string;
    scope?: 'once' | 'global';
    replace: string;
    options?: string;
  }>;
}

export interface ProxyRewriteRoutePlugin {
  uri?: string;
  method?:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'HEAD'
    | 'DELETE'
    | 'OPTIONS'
    | 'MKCOL'
    | 'COPY'
    | 'MOVE'
    | 'PROPFIND'
    | 'LOCK'
    | 'UNLOCK'
    | 'PATCH'
    | 'TRACE';
  regex_uri?: string[];
  host?: string;
  headers?: {
    add?: Record<string, string>;
    set?: Record<string, string>;
    remove?: string[];
  };
  use_real_request_uri_unsafe?: boolean;
}
export interface GrpcTranscodeRoutePlugin {
  proto_id?: string;
  proto?: string;
  service?: string;
  method?: string;
  deadline?: number;
  pb_option?: 'proto2' | 'proto3';
}

export interface GrpcWebRoutePlugin {}

export interface FaultInjectionRoutePlugin {
  abort?: {
    http_status: number;
    percentage: number;
    body?: string;
  };
  delay?: {
    duration: number;
    percentage: number;
  };
}

export interface MockingRoutePlugin {
  response_example?: string;
  response_schema?: Record<string, unknown>;
  delay?: number;
}

export interface DeGraphQLRoutePlugin {
  query: string;
  variables?: Record<string, unknown>;
  operation_name?: string;
}

export interface BodyTransformerRoutePlugin {
  request?: {
    input_format?: 'json' | 'xml' | 'encoded';
    template?: string;
  };
  response?: {
    input_format?: 'json' | 'xml' | 'encoded';
    template?: string;
  };
}

export interface AttachConsumerLabelRoutePlugin {
  headers?: Record<string, string>;
}
