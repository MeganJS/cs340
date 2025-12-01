import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
  private server: ServerFacade = new ServerFacade();
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.server.getUser({
      token: authToken.token,
      alias: alias,
    });
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const atAlias = "@" + alias;

    return await this.server.authenticate(
      { alias: atAlias, password: password },
      "login",
      "Invalid alias or password"
    );
    /*
    return await this.server.login({
      alias: alias,
      password: password,
    });
    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, authToken];
    */
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await this.server.logout({ token: authToken.token });
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const atAlias = "@" + alias;

    return await this.server.authenticate(
      {
        firstName: firstName,
        lastName: lastName,
        alias: atAlias,
        password: password,
        imageStringBase64: imageStringBase64,
        imageFileExtension: imageFileExtension,
      },
      "register",
      "Invalid registration"
    );
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    return await this.server.followAction(
      { token: authToken.token, user: userToUnfollow.DTO },
      "unfollow"
    );
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    return await this.server.followAction(
      { token: authToken.token, user: userToFollow.DTO },
      "follow"
    );
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await this.server.getFollowCount(
      { token: authToken.token, user: user.DTO },
      "followee"
    );
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await this.server.getFollowCount(
      { token: authToken.token, user: user.DTO },
      "follower"
    );
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return await this.server.getIsFollowerStatus({
      token: authToken.token,
      user: user.DTO,
      selectedUser: selectedUser.DTO,
    });
  }
}
