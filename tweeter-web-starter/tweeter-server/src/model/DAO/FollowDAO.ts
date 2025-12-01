export interface FollowDAO {
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
}
