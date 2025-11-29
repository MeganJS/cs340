import { AuthTokenDTO, UserDTO } from "tweeter-shared";

export interface AuthDAO {
  putAuthInfo(alias: string, salt: string, hash: string): Promise<void>;
  getAuthInfo(alias: string): Promise<[string, string] | null>;
  //deleteToken(token: string): Promise<void>;
  //putToken(alias: string, password: string): Promise<[UserDTO, AuthTokenDTO]>;
}
