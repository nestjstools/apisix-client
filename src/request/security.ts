export interface CorsRoutePlugin {
  allow_origins?: string;
  allow_methods?: string;
  allow_headers?: string;
  expose_headers?: string;
  max_age?: number;
  allow_credentials?: boolean;
  allow_origins_by_regex?: string[];
}

export interface IpRestrictionRoutePlugin {
  whitelist?: string[];
  blacklist?: string[];
  message?: string;
}
