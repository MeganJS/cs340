import { AuthTokenDTO, UserDTO } from "tweeter-shared";

export interface UserDAO {
  getUser(token: string, alias: string): Promise<UserDTO | null>;
  putUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<UserDTO>;
}
