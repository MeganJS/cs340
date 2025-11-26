import { AuthTokenDTO, UserDTO } from "tweeter-shared";

export interface AuthDAO {
  deleteToken(token: string): Promise<void>;
  putToken(alias: string, password: string): Promise<[UserDTO, AuthTokenDTO]>;
}
