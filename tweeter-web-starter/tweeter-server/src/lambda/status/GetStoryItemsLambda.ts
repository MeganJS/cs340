import { PagedItemRequest, PagedItemResponse, StatusDTO } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";

export const handler = async (
  request: PagedItemRequest<StatusDTO>
): Promise<PagedItemResponse<StatusDTO>> => {
  const statusService = new StatusService(DAOFactoryImpl.instance);
  const [items, hasMore] = await statusService.loadMoreStoryItems(
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
