import { FollowDAO } from "./FollowDAO";
import { DataDAO } from "./DataDAO";

export class FollowDAOImpl implements FollowDAO {
  private readonly tableDAO: DataDAO;
  private readonly tableName = "follows";
  private readonly indexName = "follows_index";
  private readonly followerAttr = "follower_handle";
  private readonly followeeAttr = "followee_handle";

  constructor(tables: DataDAO) {
    this.tableDAO = tables;
  }

  async putFollow(followerAlias: string, followeeAlias: string) {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAttr]: followerAlias,
        [this.followeeAttr]: followeeAlias,
      },
    };
    await this.tableDAO.putData(params);
  }

  async getFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: followerAlias,
        [this.followeeAttr]: followeeAlias,
      },
    };
    const output = await this.tableDAO.getData(params);
    return output.Item == undefined ? false : true;
  }

  async deleteFollow(followerAlias: string, followeeAlias: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: followerAlias,
        [this.followeeAttr]: followeeAlias,
      },
    };
    await this.tableDAO.deleteData(params);
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<[items: string[], hasMore: boolean]> {
    return await this.getPageOfFollowItems(
      followerHandle,
      pageSize,
      lastFolloweeHandle,
      this.followeeAttr,
      this.followerAttr
    );
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<[items: string[], hasMore: boolean]> {
    return await this.getPageOfFollowItems(
      followeeHandle,
      pageSize,
      lastFollowerHandle,
      this.followerAttr,
      this.followeeAttr
    );
  }

  private async getPageOfFollowItems(
    userAlias: string,
    pageSize: number,
    lastFollowItemAlias: string | undefined,
    followAttr: string,
    userFollowAttr: string
  ): Promise<[items: string[], hasMore: boolean]> {
    let params = {
      TableName: this.tableName,
      Limit: pageSize,
      KeyConditionExpression: userFollowAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": userAlias,
      },
      ExclusiveStartKey:
        lastFollowItemAlias === undefined
          ? undefined
          : {
              [userFollowAttr]: userAlias,
              [followAttr]: lastFollowItemAlias,
            },
    };
    //Source: https://www.omarileon.me/blog/typescript-merge-objects
    let data: any;
    if (followAttr === this.followerAttr) {
      let params2 = { IndexName: this.indexName, ...params };
      data = await this.tableDAO.queryData(params2);
    } else {
      data = await this.tableDAO.queryData(params);
    }

    const hasMore = data.LastEvaluatedKey !== undefined;
    const items: string[] = [];
    data.Items?.forEach((item: any) => items.push(item[followAttr]));
    return [items, hasMore];
  }
}
