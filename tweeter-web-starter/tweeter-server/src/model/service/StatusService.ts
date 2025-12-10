import { Service } from "./Service";
import { StatusDTO } from "tweeter-shared";
import { AuthenticationService } from "./AuthenticationService";
import { DAOFactory } from "../DAO/DAOFactory";
import { FollowDAO } from "../DAO/FollowDAO";
import { StatusDAO } from "../DAO/StatusDAO";

export class StatusService extends AuthenticationService implements Service {
  //private followDAO: FollowDAO;
  private statusDAO: StatusDAO;

  constructor(daoFactory: DAOFactory) {
    super(daoFactory);
    //this.followDAO = daoFactory.followDAO;
    this.statusDAO = daoFactory.statusDAO;
  }

  public async loadMoreFeedItems(
    token: string,
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    await this.checkTokenValidity(token);
    return await this.statusDAO.getPageOfFeedItems(
      alias,
      pageSize,
      lastItem === null ? undefined : lastItem
    );
  }

  public async loadMoreStoryItems(
    token: string,
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    await this.checkTokenValidity(token);
    return await this.statusDAO.getPageOfStoryItems(
      alias,
      pageSize,
      lastItem === null ? undefined : lastItem
    );
  }

  public async postStatus(token: string, newStatus: StatusDTO): Promise<void> {
    //await new Promise((f) => setTimeout(f, 2000));
    const userAlias = await this.checkTokenValidity(token);
    await this.statusDAO.putPostedStatus(userAlias, newStatus);
    /*
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
      */
  }

  public async updateFeedsFromList(
    token: string,
    aliases: string[],
    newStatus: StatusDTO
  ) {
    let itemsToSend: string[] = [];
    let sendMore: boolean = aliases.length > 0;
    while (sendMore) {
      if (aliases.length < 26) {
        await this.updateFeeds(token, aliases, newStatus);

        sendMore = false;
        break;
      }
      itemsToSend = aliases.slice(0, 25);
      aliases = aliases.slice(25);
      await this.updateFeeds(token, itemsToSend, newStatus);
      sendMore = aliases.length > 0;
    }
  }

  public async updateFeeds(
    token: string,
    aliases: string[],
    newStatus: StatusDTO
  ) {
    await this.checkTokenValidity(token);
    await this.statusDAO.putFollowedStatusBatch(aliases, newStatus);
  }
}
