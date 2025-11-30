import { User, FakeData, UserDTO, AuthTokenDTO } from "tweeter-shared";
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

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastUserItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    const [items, hasMore] = await this.followDAO.getPageOfFollowees(
      userAlias,
      pageSize,
      lastUserItem ? lastUserItem.alias : null
    );
    return [await this.assembleUsers(items), hasMore];
    //return await this.getFakeData(lastUserItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastUserItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    const [items, hasMore] = await this.followDAO.getPageOfFollowers(
      userAlias,
      pageSize,
      lastUserItem ? lastUserItem.alias : null
    );
    return [await this.assembleUsers(items), hasMore];
    //return await this.getFakeData(lastUserItem, pageSize, userAlias);
  }

  private async assembleUsers(items: string[]): Promise<UserDTO[]> {
    const users: UserDTO[] = [];
    items.forEach(async (item: string) => {
      let user = await this.userDAO.getUser(item);
      if (typeof user !== "undefined") {
        users.push(user);
      }
    });
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
    const userAlias = await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    await this.followDAO.putFollow(userAlias, userToFollow.alias);
    return await this.manageFollowCounts(userAlias, userToFollow.alias, 1);

    // Pause so we can see the follow message. Remove when connected to the server
    //await new Promise((f) => setTimeout(f, 2000));
    //await this.updateFollowCounts(userAlias, userToFollow.alias, 1);
    //await this.userDAO.updateUserFolloweesCount(userAlias, 1);
    //await this.userDAO.updateUserFollowersCount(userToFollow.alias, 1);

    // TODO: Call the server
    //const followerCount = await this.getFollowerCount(token, userToFollow);
    //const followeeCount = await this.getFolloweeCount(token, userToFollow);

    //return this.getFollowCounts(userToFollow.alias);
  }

  /*
  public async getFolloweeCount(token: string, user: UserDTO): Promise<number> {
    const userAlias = await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDTO): Promise<number> {
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    // TODO: Replace with the result of calling server
    const counts = await this.getFollowCounts(user.alias);
    return counts[0];
    //return FakeData.instance.getFollowerCount(user.alias);
  }
    */

  public async getFollowCount(
    token: string,
    alias: string,
    follower: boolean
  ): Promise<number> {
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    // TODO: Replace with the result of calling server
    const [followerCount, followeeCount] = await this.getFollowCounts(alias);
    if (follower) {
      return followerCount;
    }
    return followeeCount;
    //return counts[0];
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
    // TODO: Replace with the result of calling server
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    return await this.followDAO.getFollow(user.alias, selectedUser.alias);
    //return FakeData.instance.isFollower();
  }
}
