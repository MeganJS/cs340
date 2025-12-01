import { AuthToken, Status } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
  private server: ServerFacade = new ServerFacade();

  public async loadMoreStatusItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
    statusType: string
  ): Promise<[Status[], boolean]> {
    return await this.server.getMoreStatusItems(
      {
        token: authToken.token,
        alias: userAlias,
        pageSize: pageSize,
        lastItem: lastItem ? lastItem.DTO : null,
      },
      statusType
    );
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    await this.server.postStatus({
      token: authToken.token,
      statusItem: newStatus.DTO,
    });
  }
}
