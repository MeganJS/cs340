import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "./entities";

export class followsDAO {
  readonly tableName = "follows";
  readonly followerAttr = "follower_handle";
  readonly followerNameAttr = "follower_name";
  readonly followeeAttr = "followee_handle";
  readonly followeeNameAttr = "followee_name";
  //

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getFollowee(follower: User): Promise<User | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: follower.handle,
        [this.followerNameAttr]: follower.name,
      }, //this may need to be just the handle?
      //change to get all?
    };

    const output = await this.client.send(new GetCommand(params));
    return output.Item == undefined
      ? undefined
      : new User(
          output.Item[this.followeeAttr],
          output.Item[this.followeeNameAttr]
        );
  }

  async putFollowee(follower: User, followee: User) {
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

  async updateFollowee(follower: User, followee: User) {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: follower.handle,
        [this.followerNameAttr]: follower.name,
      },
      UpdateExpression:
        "SET " +
        {
          [this.followeeAttr]: followee.handle,
          [this.followeeNameAttr]: followee.name,
        },
    };
    await this.client.send(new UpdateCommand(params));
  }

  async deleteFollowee(follower: User, followee: User) {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: follower.handle,
        [this.followerNameAttr]: follower.name,
        [this.followeeAttr]: followee.handle,
        [this.followeeNameAttr]: followee.name,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }
}
