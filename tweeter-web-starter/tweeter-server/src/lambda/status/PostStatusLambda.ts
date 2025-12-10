import { StatusItemRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import {
  DAOFactoryImpl,
  SQS_POST_STATUS_URL,
} from "../../model/DAO/DAOFactoryImpl";
import { SqsDAO } from "../../model/DAO/SqsDAO";
import { PostStatusMessage } from "../../model/message/PostStatusMessage";

export const handler = async (
  request: StatusItemRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService(DAOFactoryImpl.instance);
  try {
    await statusService.postStatus(request.token, request.statusItem);

    const message: PostStatusMessage = {
      token: request.token,
      alias: request.statusItem.user.alias,
      status: request.statusItem,
    };
    await SqsDAO.instance.sendMessage(
      SQS_POST_STATUS_URL,
      JSON.stringify(message)
    ); //TODO is this ok? having this here, and not in a service?

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
