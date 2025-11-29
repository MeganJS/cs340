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
      },
    };
    await this.tableDAO.putData(params);
  }

  async putUserImage(imageStringBase64: string, imageFileExtension: string) {
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
