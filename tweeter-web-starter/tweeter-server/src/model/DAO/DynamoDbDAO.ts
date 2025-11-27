import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataDAO } from "./DataDAO";

export class DynamoDbDAO implements DataDAO {
  protected readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putData(requestParams: PutCommandInput): Promise<void> {
    await this.client.send(new PutCommand(requestParams));
  }

  async deleteData(requestParams: DeleteCommandInput): Promise<void> {
    await this.client.send(new DeleteCommand(requestParams));
  }

  async getData(requestParams: GetCommandInput): Promise<GetCommandOutput> {
    //const output = await this.client.send(new GetCommand(params));
    return await this.client.send(new GetCommand(requestParams));
  }
  /*
  async updateData(requestParams: UpdateCommandInput): Promise<void> {
    await this.client.send(new UpdateCommand(requestParams));
  }
    */
}
