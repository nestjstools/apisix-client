import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { Scope } from './scope';
import { ApisixRouteRequest } from '../request';

@Injectable()
export class RouteScope extends Scope {
  constructor(http: HttpService) {
    super(http, `routes`);
  }

  async getRoute(id: string) {
    return this.request('get', `/${encodeURIComponent(id)}`);
  }

  async upsertRoute(id: string, payload: ApisixRouteRequest) {
    payload.upstream.type = payload.upstream.type ?? 'roundrobin';
    return this.request('put', `/${encodeURIComponent(id)}`, payload);
  }

  async deleteRoute(id: string) {
    return this.request('delete', `/${encodeURIComponent(id)}`);
  }
}
