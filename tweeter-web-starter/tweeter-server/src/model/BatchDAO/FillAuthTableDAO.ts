import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import * as bcrypt from "bcryptjs";
import { User } from "tweeter-shared";

export class FillAuthTableDao {
  private readonly tableName = "auth";
  private readonly aliasAttribute = "alias";
  private readonly saltAttribute = "salt";
  private readonly hashAttribute = "hash";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createUserAuthItems(userList: User[], password: string) {
    if (userList.length == 0) {
      console.log("zero followers to batch write");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      RequestItems: {
        [this.tableName]: this.createPutAuthRequestItems(
          userList,
          salt,
          hashedPassword
        ),
      },
    };

    try {
      const resp = await this.client.send(new BatchWriteCommand(params));
      await this.putUnprocessedItems(resp, params);
    } catch (err) {
      throw new Error(
        `Error while batch writing users with params: ${params}: \n${err}`
      );
    }
  }

  private createPutAuthRequestItems(
    userList: User[],
    salt: string,
    hashedPassword: string
  ) {
    return userList.map((user) =>
      this.createPutAuthRequest(user, salt, hashedPassword)
    );
  }

  private createPutAuthRequest(
    user: User,
    salt: string,
    hashedPassword: string
  ) {
    const item = {
      [this.aliasAttribute]: user.alias,
      [this.saltAttribute]: salt,
      [this.hashAttribute]: hashedPassword,
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

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
      attempts++;

      if (attempts > 1) {
        // Pause before the next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Increase pause time for next attempt
        if (delay < 1000) {
          delay += 100;
        }
      }

      console.log(
        `Attempt ${attempts}. Processing ${
          Object.keys(resp.UnprocessedItems).length
        } unprocessed users.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }
}
