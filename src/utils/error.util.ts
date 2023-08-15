class ErrorHandler extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  error: unknown;

  constructor(message: string, error: unknown, statusCode: number) {
    super(message);
    this.error = error;
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
