export interface RedirectRoutePlugin {
  http_to_https?: boolean;
  uri?: string;
  regex_uri?: string[];
  ret_code?: number;
  encode_uri?: boolean;
  append_query_string?: boolean;
}

export interface EchoRoutePlugin {
  body: string;
  headers?: Record<string, string>;
  status_code?: number;
}
