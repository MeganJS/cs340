import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDAO } from "./FollowDAO";
import { UserDTO } from "tweeter-shared";
import { DAO } from "./DataDAO";

export class FollowDAOImpl extends DAO implements FollowDAO {
  //private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerAttr = "follower_handle";
  readonly followerDTO = "follower_dto";
  readonly followeeAttr = "followee_handle";
  readonly followeeDTO = "followee_dto";

  async putFollow(follower: UserDTO, followee: UserDTO) {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAttr]: follower.alias,
        [this.followerDTO]: JSON.stringify(follower),
        [this.followeeAttr]: followee.alias,
        [this.followeeDTO]: JSON.stringify(followee),
      },
    };
    await this.client.send(new PutCommand(params));
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
