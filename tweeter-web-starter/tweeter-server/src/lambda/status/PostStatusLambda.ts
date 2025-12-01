import { StatusItemRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";

export const handler = async (
  request: StatusItemRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService(DAOFactoryImpl.instance);
  await statusService.postStatus(request.token, request.statusItem);

  return {
    success: true,
    message: null,
  };
};
