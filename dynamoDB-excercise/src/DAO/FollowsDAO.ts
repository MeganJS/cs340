import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "../entity/User";

export class FollowsDAO {
  readonly tableName = "follows";
  readonly followerAttr = "follower_handle";
  readonly followerNameAttr = "follower_name";
  readonly followeeAttr = "followee_handle";
  readonly followeeNameAttr = "followee_name";
  //

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getFollow(follower: User, followee: User): Promise<User[] | undefined> {
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
      : [
          new User(
            output.Item[this.followerAttr],
            output.Item[this.followerNameAttr]
          ),
          new User(
            output.Item[this.followeeAttr],
            output.Item[this.followeeNameAttr]
          ),
        ];
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
}
