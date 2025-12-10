import { UserDTO } from "tweeter-shared";
import {
  DAOFactoryImpl,
  SQS_UPDATE_FEED_URL,
} from "../../model/DAO/DAOFactoryImpl";
import { FollowService } from "../../model/service/FollowService";
import { SqsDAO } from "../../model/DAO/SqsDAO";
import { UpdateFeedMessage } from "../../model/message/UpdateFeedMessage";
import { PostStatusMessage } from "../../model/message/PostStatusMessage";

export const handler = async function (event: any) {
  const followService = new FollowService(DAOFactoryImpl.instance);

  for (let i = 0; i < event.Records.length; ++i) {
    try {
      const startTimeMillis = new Date().getTime();

      const { body } = event.Records[i];
      // TODO: Add code to print message body to the log.

      console.log(body);

      const body_parsed: PostStatusMessage = JSON.parse(body);

      const alias: string = body_parsed.alias;
      const token: string = body_parsed.alias;
      let hasMore: boolean = true;
      let all_items: UserDTO[] = [];
      let items: UserDTO[] = [];
      let lastUserItem: UserDTO | null = null;
      let messageBody: UpdateFeedMessage;
      while (hasMore) {
        while (all_items.length < 76) {
          [items, hasMore] = await followService.loadMoreFollowees(
            token,
            alias,
            25,
            lastUserItem
          ); //TODO how to handle token???
          if (items.length > 0) {
            lastUserItem = items[items.length - 1];
          }
          all_items = [...all_items, ...items];
        }

        messageBody = {
          token: token,
          items: all_items,
          status: body_parsed.status,
        };
        await SqsDAO.instance.sendMessage(
          SQS_UPDATE_FEED_URL,
          JSON.stringify(messageBody)
        ); //TODO does this work??? is this wise???
        all_items = [];
      }

      //ensure each loop takes 1 second at least
      const elapsedTime = new Date().getTime() - startTimeMillis;
      if (elapsedTime < 1000) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, 1000 - elapsedTime)
        );
      }
    } catch (e) {
      console.log((e as Error).message);
      //TODO throw E???
    }
  }
  return null;
};
