import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export interface DataDAO<T, U> {
  //protected readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  putData(requestParams: T): Promise<void>;
  deleteData(requestParams: T): Promise<void>;
  getData(requestParams: T): Promise<U>;
  updateData(requestParams: T): Promise<void>;

  /*
  protected get client(): DynamoDBDocumentClient {
    if (this._client == null) {
        this._client = DynamoDBDocumentClient.from(new DynamoDBClient());
    }
  }
  */
}
