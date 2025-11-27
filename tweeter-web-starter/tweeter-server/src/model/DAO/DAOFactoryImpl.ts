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
  private dynamoDAO = new DynamoDbDAO();
  private s3DAO = new S3DAO();

  constructor() {
    this.followDAO = new FollowDAOImpl(this.dynamoDAO, this.s3DAO);
    //this.userDAO = new UserDAOImpl(this.dynamoDAO, this.s3DAO);
    //this.statusDAO = new StatusDAOImpl(this.dynamoDAO, this.s3DAO);
    //this.authDAO = new AuthDAOImpl(this.dynamoDAO, this.s3DAO);
  }
}
