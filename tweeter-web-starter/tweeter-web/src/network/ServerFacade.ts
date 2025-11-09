import {
  PagedItemRequest,
  PagedItemResponse,
  Status,
  StatusDTO,
  User,
  UserDTO,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://lhk36rmnv5.execute-api.us-west-2.amazonaws.com/dev";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async checkResponse<T, U>(
    response: PagedItemResponse<T>,
    items: U[] | null,
    description: string
  ): Promise<[U[], boolean]> {
    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${description} items found`);
      } else {
        return [items, response.hasMore];
      }
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
    return await this.checkResponse(response, items, followType);
    // Handle errors
    /*
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${followType}s found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
      */
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

    return await this.checkResponse(response, items, statusType);
    // Handle errors
    /*
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${statusType} items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
      */
  }
}
