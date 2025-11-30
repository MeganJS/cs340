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
import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { DataDAO } from "./DataDAO";

export class DynamoDbDAO implements DataDAO {
  private readonly client: DynamoDBClient;
  static _instance: DynamoDbDAO;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  static get instance() {
    if (!DynamoDbDAO._instance) {
      DynamoDbDAO._instance = new DynamoDbDAO();
    }
    return DynamoDbDAO._instance;
  }

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

  async updateData(requestParams: UpdateCommandInput): Promise<void> {
    await this.client.send(new UpdateCommand(requestParams));
  }
  async queryData(
    requestParams: QueryCommandInput
  ): Promise<QueryCommandOutput> {
    return await this.client.send(new QueryCommand(requestParams));
  }
}
