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
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
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

  async writeBatchData(requestParams: BatchWriteCommandInput): Promise<void> {
    const resp = await this.client.send(new BatchWriteCommand(requestParams));
    await this.putUnprocessedItems(resp, requestParams);
  }

  async deleteData(requestParams: DeleteCommandInput): Promise<void> {
    await this.client.send(new DeleteCommand(requestParams));
  }

  async getData(requestParams: GetCommandInput): Promise<GetCommandOutput> {
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

  //TODO: is this useful or slowing me down?
  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput
  ) {
    let delay = 10;
    let attempts = 0;

    while (
      resp.UnprocessedItems !== undefined &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      attempts += 1;

      if (attempts > 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        if (delay < 1000) {
          delay += 100;
        }
      }

      console.log(
        `Attempt ${attempts}. Processing ${
          Object.keys(resp.UnprocessedItems).length
        } unprocessed items.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }
}
