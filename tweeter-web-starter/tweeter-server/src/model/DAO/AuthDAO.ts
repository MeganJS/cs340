import { AuthTokenDTO } from "tweeter-shared";

export interface AuthDAO {
  putAuthInfo(alias: string, salt: string, hash: string): Promise<void>;
  getAuthInfo(alias: string): Promise<[string, string] | null>;

  putToken(
    alias: string,
    authToken: AuthTokenDTO,
    expireTime: number
  ): Promise<void>;
  deleteToken(token: string): Promise<void>;
  getTokenExpireTime(token: string): Promise<number | undefined>;
  getTokenAlias(token: string): Promise<string | undefined>;
  updateTime(
    token: string,
    timestamp: number,
    expireTime: number
  ): Promise<void>;
}
