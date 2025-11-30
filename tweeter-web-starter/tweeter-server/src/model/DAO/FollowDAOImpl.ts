import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDAO } from "./FollowDAO";
import { UserDTO } from "tweeter-shared";
import { DataDAO } from "./DataDAO";

export class FollowDAOImpl implements FollowDAO {
  //private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  private readonly tableDAO: DataDAO;
  private readonly fileDAO: DataDAO;
  private readonly tableName = "follows";
  private readonly indexName = "follows_index";
  private readonly followerAttr = "follower_handle";
  //private readonly followerDTO = "follower_dto";
  private readonly followeeAttr = "followee_handle";
  //private readonly followeeDTO = "followee_dto";

  constructor(tables: DataDAO, files: DataDAO) {
    this.tableDAO = tables;
    this.fileDAO = files;
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
      Item: {
        [this.followerAttr]: followerAlias,
        [this.followeeAttr]: followeeAlias,
      },
    };
    await this.tableDAO.deleteData(params);
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | null
  ): Promise<[items: string[], hasMore: boolean]> {
    /*
    return await this.getPageOfFollowItems(
      followerHandle,
      pageSize,
      lastFolloweeHandle,
      this.followeeAttr,
      this.followerAttr
    );
    */
    let params = {
      TableName: this.tableName,
      Limit: pageSize,
      KeyConditionExpression: this.followerAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": followerHandle,
      },
      ExclusiveStartKey:
        lastFolloweeHandle === null
          ? undefined
          : {
              [this.followerAttr]: followerHandle,
              [this.followeeAttr]: lastFolloweeHandle,
            },
    };

    let data = await this.tableDAO.queryData(params);

    const hasMore = data.LastEvaluatedKey !== undefined;
    const items: string[] = [];
    data.Items?.forEach((item: any) => items.push(item[this.followeeAttr]));
    return [items, hasMore];
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | null
  ): Promise<[items: string[], hasMore: boolean]> {
    /*
    return await this.getPageOfFollowItems(
      followeeHandle,
      pageSize,
      lastFollowerHandle,
      this.followerAttr,
      this.followeeAttr
    );
    */
    let params = {
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      KeyConditionExpression: this.followeeAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": followeeHandle,
      },
      ExclusiveStartKey:
        lastFollowerHandle === null
          ? undefined
          : {
              [this.followeeAttr]: followeeHandle,
              [this.followerAttr]: lastFollowerHandle,
            },
    };

    let data = await this.tableDAO.queryData(params);

    const hasMore = data.LastEvaluatedKey !== undefined;
    const items: string[] = [];
    data.Items?.forEach((item: any) => items.push(item[this.followerAttr]));
    return [items, hasMore];
  }

  private async getPageOfFollowItems(
    userAlias: string,
    pageSize: number,
    lastFollowItemAlias: string | null,
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
        lastFollowItemAlias === null
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

  /*
  async getPageOfFollowees(
    lastUserItem: UserDTO | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDTO[], boolean]> {
    const params = {};
  }
    */
}
