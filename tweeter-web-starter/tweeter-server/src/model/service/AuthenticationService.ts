import { AuthDAO } from "../DAO/AuthDAO";
import { DAOFactory } from "../DAO/DAOFactory";
import { Service } from "./Service";

export const VALID_DURATION = 24 * 60 * 60;

export class AuthenticationService implements Service {
  protected authDAO: AuthDAO;

  constructor(daoFactory: DAOFactory) {
    this.authDAO = daoFactory.authDAO;
  }

  async checkTokenValidity(token: string): Promise<string> {
    const timestamp: number = Date.now();
    const timestamp_seconds = Math.floor(timestamp / 1000);
    const expireTime = await this.authDAO.getTokenExpireTime(token);
    if (typeof expireTime === "undefined") {
      throw new Error("Token Not Found");
    }

    //referenced code at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
    if (timestamp_seconds > expireTime) {
      //check if this is
      await this.authDAO.deleteToken(token);
      throw new Error("Session Timed Out");
    } else {
      let newExpireTime = timestamp_seconds + VALID_DURATION;
      await this.authDAO.updateTime(token, timestamp, newExpireTime);
      const alias = await this.authDAO.getTokenAlias(token);
      if (typeof alias === "undefined") {
        throw new Error("Token Alias Not Found");
      }
      return alias;
    }
  }
}
