import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "../entity/User";
import { Follows } from "../entity/Follows";
import { DataPage } from "../entity/DataPage";

export class FollowsDAO {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerAttr = "follower_handle";
  readonly followerNameAttr = "follower_name";
  readonly followeeAttr = "followee_handle";
  readonly followeeNameAttr = "followee_name";
  //

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getFollow(
    follower: User,
    followee: User
  ): Promise<Follows | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: follower.handle,
        [this.followeeAttr]: followee.handle,
      },
    };

    //this may need to be just the handle?
    //change to get all?
    //[this.followerNameAttr]: follower.name,
    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : new Follows(
          new User(
            output.Item[this.followerAttr],
            output.Item[this.followerNameAttr]
          ),
          new User(
            output.Item[this.followeeAttr],
            output.Item[this.followeeNameAttr]
          )
        );
  }

  async putFollow(follower: User, followee: User) {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAttr]: follower.handle,
        [this.followerNameAttr]: follower.name,
        [this.followeeAttr]: followee.handle,
        [this.followeeNameAttr]: followee.name,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async updateFollow(follower: User, followee: User) {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: follower.handle,
        [this.followeeAttr]: followee.handle,
      },
      ExpressionAttributeValues: {
        ":followerName": follower.name,
        ":followeeName": followee.name,
      },
      UpdateExpression:
        "SET " +
        this.followerNameAttr +
        " = " +
        ":followerName, " +
        this.followeeNameAttr +
        " = " +
        ":followeeName",
    };
    await this.client.send(new UpdateCommand(params));
  }

  async deleteFollow(follower: User, followee: User) {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: follower.handle,
        //[this.followerNameAttr]: follower.name,
        [this.followeeAttr]: followee.handle,
        //[this.followeeNameAttr]: followee.name,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follows>> {
    const params = {
      TableName: this.tableName,
      Limit: pageSize,
      KeyConditionExpression: this.followerAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": followerHandle,
      },
      ExclusiveStartKey:
        lastFolloweeHandle === undefined
          ? undefined
          : {
              [this.followerAttr]: followerHandle,
              [this.followeeAttr]: lastFolloweeHandle,
            },
    };

    const items: Follows[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMore = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Follows(
          new User(item[this.followerAttr], item[this.followerNameAttr]),
          new User(item[this.followeeAttr], item[this.followeeNameAttr])
        )
      )
    );
    return new DataPage<Follows>(items, hasMore);
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follows>> {
    const params = {
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      KeyConditionExpression: this.followeeAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": followeeHandle,
      },
      ExclusiveStartKey:
        lastFollowerHandle === undefined
          ? undefined
          : {
              [this.followeeAttr]: followeeHandle,
              [this.followerAttr]: lastFollowerHandle,
            },
    };

    const items: Follows[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMore = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Follows(
          new User(item[this.followerAttr], item[this.followerNameAttr]),
          new User(item[this.followeeAttr], item[this.followeeNameAttr])
        )
      )
    );
    return new DataPage<Follows>(items, hasMore);
  }
}
