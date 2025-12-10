import { DataDAO } from "./DataDAO";
import {
  DeleteObjectCommand,
  DeleteObjectRequest,
  GetObjectCommand,
  GetObjectOutput,
  GetObjectRequest,
  PutObjectCommand,
  PutObjectRequest,
  RenameObjectCommand,
  RenameObjectRequest,
  S3Client,
} from "@aws-sdk/client-s3";

export class S3DAO implements DataDAO {
  static _instance: S3DAO;
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client();
  }

  static get instance() {
    if (!S3DAO._instance) {
      S3DAO._instance = new S3DAO();
    }
    return S3DAO._instance;
  }

  async putData(requestParams: PutObjectRequest): Promise<void> {
    await this.client.send(new PutObjectCommand(requestParams));
  }

  async writeBatchData(
    requestParams: BatchWriteCommandInput
  ): Promise<BatchWriteCommandOutput> {
    return await this.client.send(new BatchWriteCommand(requestParams));
  }

  async deleteData(requestParams: DeleteObjectRequest): Promise<void> {
    await this.client.send(new DeleteObjectCommand(requestParams));
  }

  async getData(requestParams: GetObjectRequest): Promise<GetObjectOutput> {
    return await this.client.send(new GetObjectCommand(requestParams));
  }

  async updateData(requestParams: RenameObjectRequest): Promise<void> {
    await this.client.send(new RenameObjectCommand(requestParams));
  }

  async queryData(requestParams: any): Promise<void> {
    console.log();
  }
}
