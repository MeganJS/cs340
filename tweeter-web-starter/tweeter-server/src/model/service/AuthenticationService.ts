import { AuthDAO } from "../DAO/AuthDAO";
import { DAOFactory } from "../DAO/DAOFactory";
import { Service } from "./Service";

export class AuthenticationService implements Service {
  protected authDAO: AuthDAO;

  constructor(daoFactory: DAOFactory) {
    this.authDAO = daoFactory.authDAO;
  }

  async checkTokenValidity(token: string): Promise<string> {
    const timestamp: number = Date.now();
    const authToken = await this.authDAO.getTokenTime(token);
    if (typeof authToken === "undefined") {
      throw new Error("Token Not Found");
    }

    //source of this code: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
    let num_seconds = Math.floor((timestamp - authToken.timestamp) / 1000);
    let num_minutes = Math.floor(num_seconds / 60);

    if (num_minutes > 240) {
      //check if this is
      await this.authDAO.deleteToken(token);
      throw new Error("Session Timed Out");
    } else {
      await this.authDAO.updateTime(token, timestamp);
      const alias = await this.authDAO.getTokenAlias(token);
      if (typeof alias === "undefined") {
        throw new Error("Token Alias Not Found");
      }
      return alias;
    }
  }
}
