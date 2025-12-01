import { CheckFollowerRequest, CheckItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";

export const handler = async (
  request: CheckFollowerRequest
): Promise<CheckItemResponse> => {
  const followService: FollowService = new FollowService(
    DAOFactoryImpl.instance
  );
  try {
    const checkResult = await followService.getIsFollowerStatus(
      request.token,
      request.user,
      request.selectedUser
    );

    return {
      success: true,
      message: null,
      checkResult: checkResult,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      checkResult: false,
    };
  }
};
