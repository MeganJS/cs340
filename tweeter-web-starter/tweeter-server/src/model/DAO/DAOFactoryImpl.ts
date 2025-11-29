import { AuthDAO } from "./AuthDAO";
import { AuthDAOImpl } from "./AuthDAOImpl";
import { DAOFactory } from "./DAOFactory";
import { DataDAO } from "./DataDAO";
import { DynamoDbDAO } from "./DynamoDbDAO";
import { FollowDAO } from "./FollowDAO";
import { FollowDAOImpl } from "./FollowDAOImpl";
import { S3DAO } from "./S3DAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";
import { UserDAOImpl } from "./UserDAOImpl";

export class DAOFactoryImpl implements DAOFactory {
  public followDAO: FollowDAO;
  //public statusDAO: StatusDAO;
  public userDAO: UserDAO;
  public authDAO: AuthDAO;
  //private dynamoDAO: DataDAO;
  //private s3DAO: DataDAO;
  static _instance: DAOFactoryImpl;

  constructor() {
    //this.dynamoDAO = new DynamoDbDAO();
    //this.s3DAO = new S3DAO();
    this.followDAO = new FollowDAOImpl(DynamoDbDAO.instance, S3DAO.instance);
    this.userDAO = new UserDAOImpl(DynamoDbDAO.instance, S3DAO.instance);
    //this.statusDAO = new StatusDAOImpl(DynamoDbDAO.instance, S3DAO.instance);
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
