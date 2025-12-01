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
    // TODO: Replace with the result of calling server
    // return FakeData.instance.findUserByAlias(alias);
    return await this.server.getUser({
      token: authToken.token,
      alias: alias,
    });
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    // const user = FakeData.instance.firstUser;
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
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    //await new Promise((res) => setTimeout(res, 1000));
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
    /*
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("Invalid registration");
    }
    return [user, FakeData.instance.authToken];
    */
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
    /*
    await new Promise((f) => setTimeout(f, 2000));
    // TODO: Call the server
    const followerCount = await this.getFollowerCount(
      authToken,
      userToUnfollow
    );
    const followeeCount = await this.getFolloweeCount(
      authToken,
      userToUnfollow
    );
    return [followerCount, followeeCount];
    */
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
    /*
    await new Promise((f) => setTimeout(f, 2000));
    // TODO: Call the server
    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
    return [followerCount, followeeCount];
    */
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    //return FakeData.instance.getFolloweeCount(user.alias);
    return await this.server.getFollowCount(
      { token: authToken.token, user: user.DTO },
      "followee"
    );
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    //return FakeData.instance.getFollowerCount(user.alias);
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
    // TODO: Replace with the result of calling server
    //return FakeData.instance.isFollower();
    return await this.server.getIsFollowerStatus({
      token: authToken.token,
      user: user.DTO,
      selectedUser: selectedUser.DTO,
    });
  }
}
