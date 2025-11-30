import { UserDTO } from "tweeter-shared";
import { UserDAO } from "./UserDAO";
import { BUCKET, DataDAO, REGION } from "./DataDAO";
import { ObjectCannedACL } from "@aws-sdk/client-s3";

export class UserDAOImpl implements UserDAO {
  private readonly tableDAO: DataDAO;
  private readonly fileDAO: DataDAO;
  private readonly tableName = "users";
  private readonly userAttr = "user_alias";
  private readonly userFirstNameAttr = "user_firstname";
  private readonly userLastNameAttr = "user_lastname";
  private readonly userImageAttr = "user_imageUrl";
  private readonly userFollowersAttr = "num_followers";
  private readonly userFolloweesAttr = "num_followees";

  constructor(tables: DataDAO, files: DataDAO) {
    this.tableDAO = tables;
    this.fileDAO = files;
  }

  async getUser(alias: string): Promise<UserDTO | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.userAttr]: alias,
      },
    };

    const output = await this.tableDAO.getData(params);
    return output.Item == undefined
      ? undefined
      : {
          firstName: output.Item[this.userFirstNameAttr],
          lastName: output.Item[this.userLastNameAttr],
          alias: output.Item[this.userAttr],
          imageUrl: output.Item[this.userImageAttr],
        };
  }

  async getUserFollowCounts(
    alias: string
  ): Promise<[followerCount: number, followeeCount: number] | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.userAttr]: alias,
      },
    };

    const output = await this.tableDAO.getData(params);
    return output.Item == undefined
      ? undefined
      : [
          output.Item[this.userFollowersAttr],
          output.Item[this.userFolloweesAttr],
        ];
  }

  private async updateUserFollowCount(
    alias: string,
    add_amount: number,
    attribute: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.userAttr]: alias,
      },
      ExpressionAttributeValues: {
        ":inc": add_amount,
      },
      UpdateExpression: "SET " + attribute + " = " + attribute + ":inc",
    };
    await this.tableDAO.updateData(params);
  }

  //TODO reduce duplication here!!!
  async updateUserFollowersCount(
    alias: string,
    add_amount: number
  ): Promise<void> {
    await this.updateUserFollowCount(alias, add_amount, this.userFollowersAttr);
  }

  async updateUserFolloweesCount(
    alias: string,
    add_amount: number
  ): Promise<void> {
    await this.updateUserFollowCount(alias, add_amount, this.userFolloweesAttr);
  }

  async putUser(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.userAttr]: alias,
        [this.userFirstNameAttr]: firstName,
        [this.userLastNameAttr]: lastName,
        [this.userImageAttr]: imageUrl,
        [this.userFollowersAttr]: 0,
        [this.userFolloweesAttr]: 0,
      },
    };
    await this.tableDAO.putData(params);
  }

  async putUserImage(
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(imageStringBase64, "base64");

    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + imageFileExtension,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    try {
      await this.fileDAO.putData(s3Params);
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${imageFileExtension}`; //TODO make sure this data is safe
    } catch (e) {
      throw Error("s3 put image failed with: " + e);
    }
  }
}
