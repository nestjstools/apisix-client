import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ClientException } from '../exception/client.exception';

export abstract class Scope {
  protected constructor(
    protected readonly http: HttpService,
    private readonly scopePath: string,
  ) {}

  protected async request<T>(
    method: 'put' | 'delete' | 'get',
    path: string,
    data?: unknown,
  ): Promise<T> {
    const response = await firstValueFrom(
      this.http
        .request<T>({
          method,
          url: `${this.scopePath}${path.startsWith('/') ? '' : '/'}${path}`,
          data,
        })
        .pipe(
          catchError((error: AxiosError) => {
            const status = error.response?.status || 500;
            const statusText =
              error.response?.statusText || 'Internal Server Error';

            throw new ClientException(status, statusText, path, error.message);
          }),
        ),
    );

    return response.data;
  }
}
