import { UserDTO } from "tweeter-shared";
import { Service } from "./Service";
import { DAOFactory } from "../DAO/DAOFactory";
import { FollowDAO } from "../DAO/FollowDAO";
import { UserDAO } from "../DAO/UserDAO";
import { AuthenticationService } from "./AuthenticationService";

export class FollowService extends AuthenticationService implements Service {
  private followDAO: FollowDAO;
  private userDAO: UserDAO;

  constructor(daoFactory: DAOFactory) {
    super(daoFactory);
    this.followDAO = daoFactory.followDAO;
    this.userDAO = daoFactory.userDAO;
  }

  //TODO reduce duplication here
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastUserItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    const [items, hasMore] = await this.followDAO.getPageOfFollowees(
      userAlias,
      pageSize,
      lastUserItem === null ? undefined : lastUserItem.alias
    );

    const userItems = await this.assembleUsers(items);
    return [userItems, hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastUserItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    const [items, hasMore] = await this.followDAO.getPageOfFollowers(
      userAlias,
      pageSize,
      lastUserItem === null ? undefined : lastUserItem.alias
    );

    const userItems = await this.assembleUsers(items);
    return [userItems, hasMore];
  }

  private async assembleUsers(items: string[]): Promise<UserDTO[]> {
    const users: UserDTO[] = [];

    for (let item of items) {
      let user = await this.userDAO.getUser(item);

      if (typeof user !== "undefined") {
        users.push(user);
      }
    }
    return users;
  }
  /*
  private async getFakeData(
    lastUserItem: UserDTO | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDTO[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDTO(lastUserItem),
      pageSize,
      userAlias
    );
    const dtos = items.map((user) => user.DTO);
    return [dtos, hasMore];
  }
    */

  public async unfollow(
    token: string,
    userToUnfollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    const userAlias = await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    await this.followDAO.deleteFollow(userAlias, userToUnfollow.alias);
    return await this.manageFollowCounts(userAlias, userToUnfollow.alias, -1);
  }

  public async follow(
    token: string,
    userToFollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    const userAlias = await this.checkTokenValidity(token);
    await this.followDAO.putFollow(userAlias, userToFollow.alias);
    return await this.manageFollowCounts(userAlias, userToFollow.alias, 1);
  }

  public async getFollowCount(
    token: string,
    alias: string,
    follower: boolean
  ): Promise<number> {
    await this.checkTokenValidity(token);
    const [followerCount, followeeCount] = await this.getFollowCounts(alias);
    if (follower) {
      return followerCount;
    }
    return followeeCount;
  }

  private async manageFollowCounts(
    userAlias: string,
    actionAlias: string,
    changeAmount: number
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.updateFollowCounts(userAlias, actionAlias, changeAmount);
    return await this.getFollowCounts(actionAlias);
  }

  private async getFollowCounts(
    alias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    const counts = await this.userDAO.getUserFollowCounts(alias);
    if (typeof counts === "undefined") {
      throw new Error(`Follow counts not found for ${alias}`);
    }

    return counts;
  }

  private async updateFollowCounts(
    userAlias: string,
    actionAlias: string,
    changeAmount: number
  ) {
    await this.userDAO.updateUserFolloweesCount(userAlias, changeAmount);
    await this.userDAO.updateUserFollowersCount(actionAlias, changeAmount);
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDTO,
    selectedUser: UserDTO
  ): Promise<boolean> {
    await this.checkTokenValidity(token);
    return await this.followDAO.getFollow(user.alias, selectedUser.alias);
  }
}
