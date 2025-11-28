import { FollowActionRequest, FollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowCountResponse> => {
  const followService: FollowService = new FollowService(
    DAOFactoryImpl.instance
  );

  const followeeCount = await followService.getFolloweeCount(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    count: followeeCount,
  };
};
