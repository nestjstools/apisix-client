import { ApisixConsumerPlugins } from '../request';

export interface ApisixResponse<T extends ApisixConsumerPlugins> {
  createdIndex: number;
  modifiedIndex: number;
  key: string;
  value: ApisixConsumerEntity<T>;
}

export interface ApisixConsumerEntity<T extends ApisixConsumerPlugins> {
  username: string;
  plugins?: ApisixConsumerPlugins;
  create_time: number;
  update_time: number;
}
