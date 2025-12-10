import { StatusItemRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";
import { MessageService } from "../../model/service/MessageService";

export const handler = async (
  request: StatusItemRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService(DAOFactoryImpl.instance);
  const messageService = new MessageService(DAOFactoryImpl.instance);
  try {
    await statusService.postStatus(request.token, request.statusItem);

    await messageService.sendPostStatusMessage(
      request.token,
      request.statusItem
    );

    return {
      success: true,
      message: null,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
    };
  }
};
