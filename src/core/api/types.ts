export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  statusCode: number;
}

export class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, string[]>;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.code = response.code;
    this.statusCode = response.statusCode;
    this.details = response.details;
  }

  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  isValidationError(): boolean {
    return this.statusCode === 422;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  data: TokenPair;
}
