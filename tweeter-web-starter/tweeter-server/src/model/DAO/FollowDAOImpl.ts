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
  private readonly followerDTO = "follower_dto";
  private readonly followeeAttr = "followee_handle";
  private readonly followeeDTO = "followee_dto";

  constructor(tables: DataDAO, files: DataDAO) {
    this.tableDAO = tables;
    this.fileDAO = files;
  }

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
    await this.tableDAO.putData(params);
    //await this.client.send(new PutCommand(params));
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
