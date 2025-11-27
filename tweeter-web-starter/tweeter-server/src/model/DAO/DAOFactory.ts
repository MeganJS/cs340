import { AuthDAO } from "./AuthDAO";
import { FollowDAO } from "./FollowDAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export abstract class DAOFactory {
  public followDAO: FollowDAO;
  public statusDAO: StatusDAO;
  public userDAO: UserDAO;
  public authDAO: AuthDAO;

  static _daoFactory: DAOFactory;
  constructor(factory: DAOFactory) {
    this.followDAO = factory.followDAO;
    this.status;
  }

  public get daoFactory(): DAOFactory {
    if (_daoFactory == null) {
    }
  }

  public set daoFactory(factory: DAOFactory) {}
}
