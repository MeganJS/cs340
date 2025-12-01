import { UserDTO } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<UserDTO | undefined>;

  getUserFollowCounts(
    alias: string
  ): Promise<[followerCount: number, followeeCount: number] | undefined>;

  updateUserFollowersCount(alias: string, add_amount: number): Promise<void>;
  updateUserFolloweesCount(alias: string, add_amount: number): Promise<void>;

  putUser(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string
  ): Promise<void>;

  putUserImage(
    alias: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<string>;
}
