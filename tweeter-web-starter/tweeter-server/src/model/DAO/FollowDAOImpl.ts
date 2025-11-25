import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDAO } from "./FollowDAO";
import { UserDTO } from "tweeter-shared";

export class FollowDAOImpl implements FollowDAO {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  private readonly tableName = "";
  private readonly indexName = "";

  async getPageOfFollowees(
    lastUserItem: UserDTO | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDTO[], boolean]> {
    const params = {};
  }
}
