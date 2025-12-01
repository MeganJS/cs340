import {
  AuthRequest,
  AuthResponse,
  AuthToken,
  CheckFollowerRequest,
  CheckItemResponse,
  FollowActionRequest,
  FollowActionResponse,
  FollowCountResponse,
  PagedItemRequest,
  PagedItemResponse,
  Status,
  StatusDTO,
  StatusItemRequest,
  TokenRequest,
  TweeterResponse,
  User,
  UserDTO,
  UserItemRequest,
  UserItemResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://lhk36rmnv5.execute-api.us-west-2.amazonaws.com/dev";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private checkItemsResponse<T, U>(
    response: PagedItemResponse<T>,
    items: U[] | null,
    description: string
  ) {
    // Handle errors
    this.checkResponse(response, () => {
      if (items == null) {
        throw new Error(`No ${description} items found`);
      }
    });
  }

  private checkAuthResponse(
    response: AuthResponse,
    user: User | null,
    authToken: AuthToken | null,
    message: string
  ) {
    this.checkResponse(response, () => {
      if (user == null || authToken == null) {
        throw new Error(message);
      }
    }); //TODO check if user is null?
  }

  private checkResponse<REQ extends TweeterResponse>(
    response: REQ,
    responseOperation: () => void
  ) {
    if (response.success) {
      responseOperation();
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFollowItems(
    request: PagedItemRequest<UserDTO>,
    followType: string
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDTO>,
      PagedItemResponse<UserDTO>
    >(request, `/${followType}/list`);

    // Convert the UserDTO array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDTO(dto) as User)
        : null;
    try {
      this.checkItemsResponse(response, items, followType);
    } catch (e: any) {
      throw new Error(e.message);
    }
    return [items!, response.hasMore];
  }

  public async getMoreStatusItems(
    request: PagedItemRequest<StatusDTO>,
    statusType: string
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDTO>,
      PagedItemResponse<StatusDTO>
    >(request, `/status/${statusType}`);

    // Convert the UserDTO array returned by ClientCommunicator to a User array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDTO(dto) as Status)
        : null;
    try {
      this.checkItemsResponse(response, items, statusType);
    } catch (e: any) {
      throw new Error(e.message);
    }
    return [items!, response.hasMore];
  }

  public async postStatus(request: StatusItemRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      StatusItemRequest,
      TweeterResponse
    >(request, "/status");

    this.checkResponse(response, () => {});
  }

  public async getUser(request: UserItemRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      UserItemRequest,
      UserItemResponse
    >(request, "/user");
    const user = User.fromDTO(response.user);

    try {
      this.checkResponse(response, () => {});
    } catch (e: any) {
      throw new Error(e.message);
    }
    return user;
  }

  public async authenticate<REQ extends AuthRequest>(
    request: REQ,
    path: string,
    errMessage: string
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<REQ, AuthResponse>(
      request,
      `/auth/${path}`
    );

    const user = User.fromDTO(response.user);
    const authToken = AuthToken.fromDTO(response.authToken);
    try {
      this.checkAuthResponse(response, user, authToken, errMessage);
    } catch (e: any) {
      throw new Error(e.message);
    }
    return [user!, authToken!]; //TODO test this
  }

  public async logout(request: TokenRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      TokenRequest,
      TweeterResponse
    >(request, "/auth/logout");

    this.checkResponse(response, () => {});
  }

  public async followAction(
    request: FollowActionRequest,
    path: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, `/user/${path}`);

    try {
      this.checkResponse(response, () => {}); //TODO consider error checking?
    } catch (e: any) {
      throw new Error(e.message);
    }
    return [response.followerCount, response.followeeCount]; //TODO test this
  }

  public async getFollowCount(
    request: FollowActionRequest,
    path: string
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowCountResponse
    >(request, `/${path}/count`);

    try {
      this.checkResponse(response, () => {}); //TODO consider error checking?
    } catch (e: any) {
      throw new Error(e.message);
    }
    return response.count; //TODO test this
  }

  public async getIsFollowerStatus(
    request: CheckFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      CheckFollowerRequest,
      CheckItemResponse
    >(request, "/user/is_follower");

    try {
      this.checkResponse(response, () => {}); //TODO consider error checking?
    } catch (e: any) {
      throw new Error(e.message);
    }
    return response.checkResult;
  }
}
