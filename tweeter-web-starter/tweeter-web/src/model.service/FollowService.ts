import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service {
  private server: ServerFacade = new ServerFacade();

  public async loadMoreFollowItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastUserItem: User | null,
    followType: string
  ): Promise<[User[], boolean]> {
    return await this.server.getMoreFollowItems(
      {
        token: authToken.token,
        alias: userAlias,
        pageSize: pageSize,
        lastItem: lastUserItem ? lastUserItem.DTO : null,
      },
      followType
    );
  }
}
