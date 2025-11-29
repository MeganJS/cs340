import { FakeData, UserDTO, AuthTokenDTO, AuthToken } from "tweeter-shared";
import { Service } from "./Service";
import { UserDAO } from "../DAO/UserDAO";
import { DAOFactory } from "../DAO/DAOFactory";
import bcrypt from "bcryptjs";
import { AuthDAO } from "../DAO/AuthDAO";

export class UserService implements Service {
  private userDAO: UserDAO;
  private authDAO: AuthDAO;

  constructor(daoFactory: DAOFactory) {
    this.userDAO = daoFactory.userDAO;
    this.authDAO = daoFactory.authDAO;
  }

  public async getUser(token: string, alias: string): Promise<UserDTO | null> {
    // TODO: Replace with the result of calling server
    //const user = FakeData.instance.findUserByAlias(alias);
    const user = await this.userDAO.getUser(alias);
    return user == null ? null : user;
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    // TODO: Replace with the result of calling the server

    //steps:
    //get stored salt for username
    //append it to password
    //hash
    //compare our hash with stored hash
    const authInfo = await this.authDAO.getAuthInfo(alias);

    if (authInfo === null) {
      throw new Error("Invalid alias or password");
    }

    //const salt = authInfo[0];
    const hash = authInfo[1];
    //const hashPass = bcrypt.hashSync(password, salt);

    if (!bcrypt.compareSync(password, hash)) {
      //TOdo check if correct???
      throw new Error("Invalid alias or password");
    }

    const user = await this.userDAO.getUser(alias);
    if (typeof user == "undefined") {
      throw new Error("Invalid alias or password");
    }

    //create new authToken and put in session with timestamp
    const authToken = AuthToken.Generate();
    //TODO!!!
    //check if the user already has an authToken. If so, replace it with this one.

    //const user = FakeData.instance.firstUser;
    return [user, authToken.DTO];
  }

  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    //const imageStringBase64: string =
    //  Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    //const user = FakeData.instance.firstUser;
    const userCheck = await this.userDAO.getUser(alias);

    if (typeof userCheck != "undefined") {
      throw new Error("Alias already in use");
    }

    //TODO insert image into s3, get URL
    const imageUrl = "haven't done this yet";
    this.userDAO.putUser(firstName, lastName, alias, imageUrl);

    //get random salt, append to password, hash password, put in auth table
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    await this.authDAO.putAuthInfo(alias, salt, hash);

    //create new authToken and put in session with timestamp
    const authToken = AuthToken.Generate();
    //TODO!!!

    //return created user (get from database or no?)
    const user = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      imageUrl: imageUrl,
    };

    return [user, authToken.DTO];
  }

  /*
  public async unfollow(
    token: string,
    userToUnfollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server
    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }

  public async follow(
    token: string,
    userToFollow: UserDTO
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server
    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async getFolloweeCount(token: string, user: UserDTO): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDTO): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDTO,
    selectedUser: UserDTO
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }
    */
}
