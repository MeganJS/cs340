import { AuthTokenDTO, UserDTO } from "tweeter-shared";
import { AuthDAO } from "./AuthDAO";
import { DataDAO } from "./DataDAO";

export class AuthDAOImpl implements AuthDAO {
  private readonly tableDAO: DataDAO;
  //private readonly fileDAO: DataDAO;
  private readonly authTableName = "auth";
  private readonly authAttr = "alias";
  private readonly authHashAttr = "hash";
  private readonly authSaltAttr = "salt";

  private readonly sessTableName = "sessions";
  //private readonly sessIndexName = "alias_index";
  private readonly sessTokenAttr = "token";
  private readonly sessAliasAttr = "alias";
  private readonly sessTimeAttr = "date_time";
  private readonly sessExpireAttr = "expire_at";

  constructor(tables: DataDAO) {
    this.tableDAO = tables;
    //this.fileDAO = files;
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

  async putToken(
    alias: string,
    authToken: AuthTokenDTO,
    expireTime: number
  ): Promise<void> {
    const params = {
      TableName: this.sessTableName,
      Item: {
        [this.sessTokenAttr]: authToken.token,
        [this.sessTimeAttr]: authToken.timestamp,
        [this.sessAliasAttr]: alias,
        [this.sessExpireAttr]: expireTime,
      },
    };
    await this.tableDAO.putData(params);
  }

  async deleteToken(token: string): Promise<void> {
    const params = {
      TableName: this.sessTableName,
      Key: {
        [this.sessTokenAttr]: token,
      },
    };
    await this.tableDAO.deleteData(params);
  }

  async getTokenExpireTime(token: string): Promise<number | undefined> {
    const params = {
      TableName: this.sessTableName,
      Key: {
        [this.sessTokenAttr]: token,
      },
    };

    const output = await this.tableDAO.getData(params);
    return output.Item == undefined
      ? undefined
      : output.Item[this.sessExpireAttr];
  }

  async getTokenAlias(token: string): Promise<string | undefined> {
    const params = {
      TableName: this.sessTableName,
      Key: {
        [this.sessTokenAttr]: token,
      },
    };

    const output = await this.tableDAO.getData(params);
    return output.Item == undefined
      ? undefined
      : output.Item[this.sessAliasAttr];
  }
  /*
  async getToken(alias: string): Promise<AuthTokenDTO | undefined> {
    const params = {
      TableName: this.sessTableName,
      IndexName: this.sessIndexName,

      Key: {
        [this.sessAliasAttr]: alias,
      },
    };
    const output = await this.tableDAO.getData(params);
    return output.Item == undefined
      ? undefined
      : {
          token: output.Item[this.sessTokenAttr],
          timestamp: output.Item[this.sessTimeAttr],
        };
  }
*/
  async updateTime(
    token: string,
    timestamp: number,
    expireTime: number
  ): Promise<void> {
    const params = {
      TableName: this.sessTableName,
      Key: {
        [this.sessTokenAttr]: token,
      },
      ExpressionAttributeValues: {
        ":date_time": timestamp,
        ":expire_at": expireTime,
      },
      UpdateExpression:
        "SET " +
        this.sessTimeAttr +
        " = " +
        ":date_time, " +
        this.sessExpireAttr +
        " = " +
        ":expire_at",
    };
    await this.tableDAO.updateData(params);
  }
}
