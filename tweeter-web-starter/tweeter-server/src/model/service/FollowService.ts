import { User, FakeData, UserDTO } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService implements Service {
  public async loadMoreFollowees(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastUserItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastUserItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastUserItem: UserDTO | null
  ): Promise<[UserDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastUserItem, pageSize, userAlias);
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
}
