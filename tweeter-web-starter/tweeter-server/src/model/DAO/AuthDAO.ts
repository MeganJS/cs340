import { AuthTokenDTO, UserDTO } from "tweeter-shared";

export interface AuthDAO {
  putAuthInfo(alias: string, salt: string, hash: string): Promise<void>;
  getAuthInfo(alias: string): Promise<[string, string] | null>;

  putToken(alias: string, authToken: AuthTokenDTO): Promise<void>;
  deleteToken(token: string): Promise<void>;
  getTokenTime(token: string): Promise<AuthTokenDTO | undefined>;
  getTokenAlias(token: string): Promise<string | undefined>;
  //getToken(alias: string): Promise<AuthTokenDTO | undefined>;
  updateTime(token: string, timestamp: number): Promise<void>;
}
