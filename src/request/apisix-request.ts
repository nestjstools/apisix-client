import { ApisixConsumerPlugins, ApisixRoutePlugins } from './plugin';

export interface ApisixRouteRequest {
  id?: string;
  name?: string;
  uri: string;
  methods?: string[];
  upstream: {
    type?: 'roundrobin' | 'chash' | 'ewma' | 'least_conn';
    nodes: Record<string, number>;
  };
  plugins?: ApisixRoutePlugins;
  status?: 0 | 1;
}

export interface ApisixConsumerRequest {
  username: string;
  plugins?: ApisixConsumerPlugins;
  desc?: string;
}
