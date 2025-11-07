import { StatusItemRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: StatusItemRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  await statusService.postStatus(request.token, request.statusItem);

  return {
    success: true,
    message: null,
  };
};
