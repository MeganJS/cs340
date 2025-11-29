import { AuthTokenDTO, UserDTO } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<UserDTO | undefined>;

  putUser(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string
  ): Promise<void>;
}
