import { FollowActionRequest, FollowActionResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowActionResponse> => {
  const followService: FollowService = new FollowService(
    DAOFactoryImpl.instance
  );

  const [followerCount, followeeCount] = await followService.follow(
    request.token,
    request.user
  );

  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
