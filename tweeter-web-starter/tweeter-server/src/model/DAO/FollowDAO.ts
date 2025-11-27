import { UserDTO } from "tweeter-shared";

export interface FollowDAO {
  /*
  getPageOfFollowees(
    lastUserItem: UserDTO | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDTO[], boolean]>;
  */
  /*
  getPageOfFollowers(
    lastUserItem: UserDTO | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDTO[], boolean]>;
  */
  putFollow(user: UserDTO, userToFollow: UserDTO): Promise<void>;
  /*
  deleteFollow(
    token: string,
    userToUnfollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]>;
  getFollowerStatus(
    token: string,
    user: UserDTO,
    selectedUser: UserDTO
  ): Promise<boolean>;
  getFolloweeCount(token: string, user: UserDTO): Promise<number>;
  getFollowerCount(token: string, user: UserDTO): Promise<number>;
  */
}
