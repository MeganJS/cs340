import { CheckFollowerRequest, CheckItemResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: CheckFollowerRequest
): Promise<CheckItemResponse> => {
  const userService: UserService = new UserService();

  const checkResult = await userService.getIsFollowerStatus(
    request.token,
    request.user,
    request.selectedUser
  );

  return {
    success: true,
    message: null,
    checkResult: checkResult,
  };
};
