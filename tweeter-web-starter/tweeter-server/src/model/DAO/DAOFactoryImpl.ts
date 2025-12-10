import { AuthDAO } from "./AuthDAO";
import { AuthDAOImpl } from "./AuthDAOImpl";
import { DAOFactory } from "./DAOFactory";
import { DynamoDbDAO } from "./DynamoDbDAO";
import { FollowDAO } from "./FollowDAO";
import { FollowDAOImpl } from "./FollowDAOImpl";
import { S3DAO } from "./S3DAO";
import { StatusDAO } from "./StatusDAO";
import { StatusDAOImpl } from "./StatusDAOImpl";
import { UserDAO } from "./UserDAO";
import { UserDAOImpl } from "./UserDAOImpl";

export const BUCKET: string = "cs340-tweeter-images-247";
export const REGION: string = "us-west-2";
export const SQS_POST_STATUS_URL: string = "";
export const SQS_UPDATE_FEED_URL: string = "";

export class DAOFactoryImpl implements DAOFactory {
  public followDAO: FollowDAO;
  public statusDAO: StatusDAO;
  public userDAO: UserDAO;
  public authDAO: AuthDAO;
  static _instance: DAOFactoryImpl;

  constructor() {
    this.followDAO = new FollowDAOImpl(DynamoDbDAO.instance);
    this.userDAO = new UserDAOImpl(DynamoDbDAO.instance, S3DAO.instance);
    this.statusDAO = new StatusDAOImpl(DynamoDbDAO.instance);
    this.authDAO = new AuthDAOImpl(DynamoDbDAO.instance);
  }

  public static get instance(): DAOFactoryImpl {
    if (!DAOFactoryImpl._instance) {
      DAOFactoryImpl._instance = new DAOFactoryImpl();
    }
    return DAOFactoryImpl._instance;
  }

  public static set instance(ins: DAOFactoryImpl) {
    DAOFactoryImpl._instance = ins;
  }
}
