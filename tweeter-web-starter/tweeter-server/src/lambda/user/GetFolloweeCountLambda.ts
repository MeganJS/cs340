import { FollowActionRequest, FollowCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowCountResponse> => {
  const userService: UserService = new UserService();

  const followeeCount = await userService.getFolloweeCount(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    count: followeeCount,
  };
};
