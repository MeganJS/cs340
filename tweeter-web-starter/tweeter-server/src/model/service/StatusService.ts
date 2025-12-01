import { FakeData, Status } from "tweeter-shared";
import { Service } from "./Service";
import { StatusDTO } from "tweeter-shared";
import { AuthenticationService } from "./AuthenticationService";
import { DAOFactory } from "../DAO/DAOFactory";
import { FollowDAO } from "../DAO/FollowDAO";
import { UserDAO } from "../DAO/UserDAO";
import { StatusDAO } from "../DAO/StatusDAO";

export class StatusService extends AuthenticationService implements Service {
  private followDAO: FollowDAO;
  private userDAO: UserDAO;
  private statusDAO: StatusDAO;

  constructor(daoFactory: DAOFactory) {
    super(daoFactory);
    this.followDAO = daoFactory.followDAO;
    this.userDAO = daoFactory.userDAO;
    this.statusDAO = daoFactory.statusDAO;
  }

  public async loadMoreFeedItems(
    token: string,
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    await this.checkTokenValidity(token);
    return await this.getFakeData(pageSize, lastItem);
  }

  public async loadMoreStoryItems(
    token: string,
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    await this.checkTokenValidity(token);
    return await this.getFakeData(pageSize, lastItem);
  }

  private async getFakeData(
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDTO(lastItem),
      pageSize
    );

    const dtos = items.map((status) => status.DTO);
    return [dtos, hasMore];
  }

  public async postStatus(token: string, newStatus: StatusDTO): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    //await new Promise((f) => setTimeout(f, 2000));
    // TODO: Call the server to post the status

    const userAlias = await this.checkTokenValidity(token);
    await this.statusDAO.putPostedStatus(userAlias, newStatus);

    let hasMore = true;
    let lastFollowerHandle: string | undefined = undefined;
    let items: string[] = [];
    while (hasMore) {
      [items, hasMore] = await this.followDAO.getPageOfFollowers(
        userAlias,
        25,
        lastFollowerHandle
      );
      for (let item of items) {
        await this.statusDAO.putFollowedStatus(item, newStatus);
      }
      lastFollowerHandle = items[items.length - 1];
    }
  }
}
