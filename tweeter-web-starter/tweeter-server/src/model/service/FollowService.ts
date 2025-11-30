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
    return await this.getFakeData(lastUserItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastUserItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    return await this.getFakeData(lastUserItem, pageSize, userAlias);
  }

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

  public async unfollow(
    token: string,
    userToUnfollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    // Pause so we can see the unfollow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));
    await this.followDAO.deleteFollow("@arnold", userToUnfollow.alias);

    // TODO: Call the server
    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  public async follow(
    token: string,
    userToFollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    // Pause so we can see the follow message. Remove when connected to the server
    //await new Promise((f) => setTimeout(f, 2000));
    await this.followDAO.putFollow("@arnold", userToFollow.alias);

    // TODO: Call the server
    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async getFolloweeCount(token: string, user: UserDTO): Promise<number> {
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDTO): Promise<number> {
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDTO,
    selectedUser: UserDTO
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?
    return FakeData.instance.isFollower();
  }
}
