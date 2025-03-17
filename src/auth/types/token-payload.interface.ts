export interface TokenPayload {
  sub: string;
  iat: number;
  permissions: string[];
}
