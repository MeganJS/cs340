import { PagedItemRequest, PagedItemResponse, UserDTO } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";

export const handler = async (
  request: PagedItemRequest<UserDTO>
): Promise<PagedItemResponse<UserDTO>> => {
  const followService = new FollowService(DAOFactoryImpl.instance);
  const [items, hasMore] = await followService.loadMoreFollowers(
    request.token,
    request.alias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
