import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { Scope } from './scope';
import { ApisixConsumerPlugins, ApisixConsumerRequest } from '../request';
import { ApisixResponse } from '../response/apisix-response';

@Injectable()
export class ConsumerScope extends Scope {
  constructor(http: HttpService) {
    super(http, `consumers`);
  }

  async getConsumer<T extends ApisixConsumerPlugins>(
    username: string,
  ): Promise<ApisixResponse<T>> {
    return this.request('get', `/${encodeURIComponent(username)}`);
  }

  async upsertConsumer<T extends ApisixConsumerPlugins>(
    payload: ApisixConsumerRequest,
  ): Promise<ApisixResponse<T>> {
    return this.request(
      'put',
      `/${encodeURIComponent(payload.username)}`,
      payload,
    );
  }

  async deleteConsumer(username: string) {
    return this.request('delete', `/${encodeURIComponent(username)}`);
  }
}
