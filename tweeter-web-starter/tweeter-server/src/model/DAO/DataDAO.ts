import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export interface DataDAO {
  putData(requestParams: any): Promise<void>;
  deleteData(requestParams: any): Promise<void>;
  getData(requestParams: any): Promise<any>;
  updateData(requestParams: any): Promise<void>;
}
