import { AuthDAO } from "./AuthDAO";
import { DAOFactory } from "./DAOFactory";
import { DynamoDbDAO } from "./DynamoDbDAO";
import { FollowDAO } from "./FollowDAO";
import { FollowDAOImpl } from "./FollowDAOImpl";
import { S3DAO } from "./S3DAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export class DAOFactoryImpl implements DAOFactory {
  public followDAO: FollowDAO;
  //public statusDAO: StatusDAO;
  //public userDAO: UserDAO;
  //public authDAO: AuthDAO;
  //private dynamoDAO = new DynamoDbDAO();
  //private s3DAO = new S3DAO();
  static _instance: DAOFactoryImpl;

  constructor() {
    this.followDAO = new FollowDAOImpl(new DynamoDbDAO(), new S3DAO());
    //this.userDAO = new UserDAOImpl(this.dynamoDAO, this.s3DAO);
    //this.statusDAO = new StatusDAOImpl(this.dynamoDAO, this.s3DAO);
    //this.authDAO = new AuthDAOImpl(this.dynamoDAO, this.s3DAO);
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
