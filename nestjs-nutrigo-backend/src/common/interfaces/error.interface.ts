export interface StandardErrorResponse {
  readonly success: false;
  readonly message: string | string[];
  readonly errorCode: string;
  readonly statusCode: number;
}
