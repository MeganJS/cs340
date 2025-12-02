import { StatusDTO } from "tweeter-shared";
import { DataDAO } from "./DataDAO";
import { StatusDAO } from "./StatusDAO";

export class StatusDAOImpl implements StatusDAO {
  private readonly tableDAO: DataDAO;
  private readonly storyTableName = "statuses";
  private readonly feedTableName = "feeds";
  private readonly userAttr = "user_alias";
  private readonly timeAttr = "timestamp";
  private readonly feedAttr = "followed_status";
  private readonly storyAttr = "posted_status";

  constructor(tables: DataDAO) {
    this.tableDAO = tables;
  }

  async putPostedStatus(alias: string, newStatus: StatusDTO): Promise<void> {
    await this.putStatus(alias, newStatus, this.storyTableName, this.storyAttr);
  }

  async putFollowedStatus(alias: string, newStatus: StatusDTO): Promise<void> {
    await this.putStatus(alias, newStatus, this.feedTableName, this.feedAttr);
  }

  private async putStatus(
    alias: string,
    newStatus: StatusDTO,
    table: string,
    statusAttr: string
  ): Promise<void> {
    const params = {
      TableName: table,
      Item: {
        [this.userAttr]: alias,
        [this.timeAttr]: newStatus.timestamp,
        [statusAttr]: JSON.stringify(newStatus),
      },
    };
    await this.tableDAO.putData(params);
  }

  async getPageOfStoryItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | undefined
  ): Promise<[StatusDTO[], boolean]> {
    return await this.getPageOfStatusItems(
      alias,
      pageSize,
      lastItem,
      this.storyTableName,
      this.storyAttr
    );
  }

  async getPageOfFeedItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | undefined
  ): Promise<[StatusDTO[], boolean]> {
    return await this.getPageOfStatusItems(
      alias,
      pageSize,
      lastItem,
      this.feedTableName,
      this.feedAttr
    );
  }

  private async getPageOfStatusItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDTO | undefined,
    tableAttr: string,
    statusAttr: string
  ): Promise<[items: StatusDTO[], hasMore: boolean]> {
    let params = {
      TableName: tableAttr,
      Limit: pageSize,
      KeyConditionExpression: this.userAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": userAlias,
      },
      ExclusiveStartKey:
        lastItem === undefined
          ? undefined
          : {
              [this.userAttr]: userAlias,
              [this.timeAttr]: lastItem.timestamp,
              //[statusAttr]: JSON.stringify(lastItem),
            },
      ScanIndexForward: false,
    };
    let data = await this.tableDAO.queryData(params);

    const hasMore = data.LastEvaluatedKey !== undefined;
    const items: StatusDTO[] = [];
    data.Items?.forEach((item: any) =>
      items.push(JSON.parse(item[statusAttr]))
    );
    return [items, hasMore];
  }
}
