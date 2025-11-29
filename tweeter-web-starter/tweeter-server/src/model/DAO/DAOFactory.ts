import { AuthDAO } from "./AuthDAO";
import { FollowDAO } from "./FollowDAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export interface DAOFactory {
  followDAO: FollowDAO;
  //statusDAO: StatusDAO;
  userDAO: UserDAO;
  authDAO: AuthDAO;
}
