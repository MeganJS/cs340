import { DataDAO } from "./DataDAO";
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectRequest,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectOutput,
  GetObjectRequest,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectRequest,
  S3Client,
} from "@aws-sdk/client-s3";

export class S3DAO implements DataDAO {
  protected readonly client = new S3Client();

  async putData(requestParams: PutObjectRequest): Promise<void> {
    await this.client.send(new PutObjectCommand(requestParams));
  }

  async deleteData(requestParams: DeleteObjectRequest): Promise<void> {
    await this.client.send(new DeleteObjectCommand(requestParams));
  }

  async getData(requestParams: GetObjectRequest): Promise<GetObjectOutput> {
    //const output = await this.client.send(new GetCommand(params));
    return await this.client.send(new GetObjectCommand(requestParams));
  }
  /*
  async updateData(requestParams: UpdateObjectRequest): Promise<void> {
    await this.client.send(new UpdateObjectCommand(requestParams));
  }
    */
}
