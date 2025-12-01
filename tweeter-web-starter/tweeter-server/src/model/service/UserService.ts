import { UserDTO, AuthTokenDTO, AuthToken } from "tweeter-shared";
import { Service } from "./Service";
import { UserDAO } from "../DAO/UserDAO";
import { DAOFactory } from "../DAO/DAOFactory";
import bcrypt from "bcryptjs";
import { AuthenticationService, VALID_DURATION } from "./AuthenticationService";

export class UserService extends AuthenticationService implements Service {
  private userDAO: UserDAO;

  constructor(daoFactory: DAOFactory) {
    super(daoFactory);
    this.userDAO = daoFactory.userDAO;
  }

  public async getUser(token: string, alias: string): Promise<UserDTO | null> {
    await this.checkTokenValidity(token); //TODO do I need to propagate errors?

    const user = await this.userDAO.getUser(alias);
    return user == null ? null : user;
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    //steps:
    //get stored salt for username, append it to password, hash, compare our hash with stored hash
    const authInfo = await this.authDAO.getAuthInfo(alias);

    if (authInfo === null) {
      throw new Error("Invalid alias or password");
    }

    //const salt = authInfo[0];
    const hash = authInfo[1];
    //const hashPass = bcrypt.hashSync(password, salt);
    if (!bcrypt.compareSync(password, hash)) {
      throw new Error("Invalid alias or password");
    }

    const user = await this.userDAO.getUser(alias);
    if (typeof user == "undefined") {
      throw new Error("Invalid alias or password");
    }
    const authToken = AuthToken.Generate().DTO;
    const expireTime = Math.floor(authToken.timestamp / 1000) + VALID_DURATION;
    await this.authDAO.putToken(alias, authToken, expireTime);

    return [user, authToken];
  }

  public async logout(token: string): Promise<void> {
    //await new Promise((res) => setTimeout(res, 1000));
    await this.authDAO.deleteToken(token);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDTO, AuthTokenDTO]> {
    const userCheck = await this.userDAO.getUser(alias);
    if (typeof userCheck != "undefined") {
      throw new Error("Alias already in use");
    }

    //get random salt, append to password, hash password, put in auth table
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await this.authDAO.putAuthInfo(alias, salt, hash);

    //insert image to s3
    //const saferImageExtension = encodeURI(imageFileExtension);
    const imageUrl = await this.userDAO.putUserImage(
      alias,
      imageStringBase64,
      imageFileExtension
    );
    await this.userDAO.putUser(firstName, lastName, alias, imageUrl);

    const authToken = AuthToken.Generate().DTO;
    const expireTime = Math.floor(authToken.timestamp / 1000) + VALID_DURATION;
    await this.authDAO.putToken(alias, authToken, expireTime);

    //return created user (get from database or no?)
    const user = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      imageUrl: imageUrl,
    };

    return [user, authToken];
  }
}
