export class ClientException extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly url: string,
    message?: string,
  ) {
    super(message || `HTTP [${status}]: [${statusText}] for [${url}]`);
    this.name = 'ClientException';
  }
}
