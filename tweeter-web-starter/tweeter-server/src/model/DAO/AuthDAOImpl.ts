import { AuthTokenDTO, UserDTO } from "tweeter-shared";
import { AuthDAO } from "./AuthDAO";
import { DataDAO } from "./DataDAO";

export class AuthDAOImpl implements AuthDAO {
  private readonly tableDAO: DataDAO;
  private readonly fileDAO: DataDAO;
  private readonly authTableName = "auth";
  private readonly authAttr = "alias";
  private readonly authHashAttr = "hash";
  private readonly authSaltAttr = "salt";

  private readonly sessTableName = "sessons";
  private readonly sessTokenAttr = "token";
  private readonly sessAliasAttr = "user_alias";
  private readonly sessTimeAttr = "token_date_time";

  constructor(tables: DataDAO, files: DataDAO) {
    this.tableDAO = tables;
    this.fileDAO = files;
  }

  async putAuthInfo(alias: string, salt: string, hash: string): Promise<void> {
    const params = {
      TableName: this.authTableName,
      Item: {
        [this.authAttr]: alias,
        [this.authSaltAttr]: salt,
        [this.authHashAttr]: hash,
      },
    };
    await this.tableDAO.putData(params);
  }

  async getAuthInfo(alias: string): Promise<[string, string] | null> {
    const params = {
      TableName: this.authTableName,
      Key: {
        [this.authAttr]: alias,
      },
    };

    const output = await this.tableDAO.getData(params);
    return output.Item == undefined
      ? null
      : [output.Item[this.authSaltAttr], output.Item[this.authHashAttr]];
  }

  //deleteToken(token: string): Promise<void>;
  //putToken(alias: string, password: string): Promise<[UserDTO, AuthTokenDTO]>;
}
