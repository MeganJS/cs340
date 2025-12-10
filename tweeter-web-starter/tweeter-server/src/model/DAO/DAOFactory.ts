import { AuthDAO } from "./AuthDAO";
import { FollowDAO } from "./FollowDAO";
import { SqsDAO } from "./SqsDAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export interface DAOFactory {
  followDAO: FollowDAO;
  statusDAO: StatusDAO;
  userDAO: UserDAO;
  authDAO: AuthDAO;
  sqsDAO: SqsDAO;
}
