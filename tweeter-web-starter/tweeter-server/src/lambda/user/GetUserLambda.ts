import { UserItemRequest, UserItemResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: UserItemRequest
): Promise<UserItemResponse> => {
  const userService: UserService = new UserService();

  const user = await userService.getUser(request.token, request.alias);

  return {
    success: true,
    message: null,
    user: user,
  };
};
