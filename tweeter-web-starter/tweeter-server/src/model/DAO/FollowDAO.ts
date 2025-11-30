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
  putFollow(userAlias: string, userToFollowAlias: string): Promise<void>;

  getFollow(userAlias: string, selectedAlias: string): Promise<boolean>;

  deleteFollow(userAlias: string, userToUnfollowAlias: string): Promise<void>;

  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<[items: string[], hasMore: boolean]>;

  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<[items: string[], hasMore: boolean]>;
  /*
  getFollowerStatus(
    token: string,
    user: UserDTO,
    selectedUser: UserDTO
  ): Promise<boolean>;
  getFolloweeCount(token: string, user: UserDTO): Promise<number>;
  getFollowerCount(token: string, user: UserDTO): Promise<number>;
  */
}
