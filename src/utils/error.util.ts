export class ErrorHandler extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  error: unknown;

  constructor(message: string, statusCode: number, error?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class PageNotFound extends ErrorHandler {
  url: string;

  constructor(url: string) {
    super(`Can't find this ${url} on server`, 404);

    this.url = url;
  }
}
