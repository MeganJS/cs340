import { Service } from "./Service";
import { StatusDTO, UserDTO } from "tweeter-shared";
import { DAOFactory } from "../DAO/DAOFactory";
import { SqsDAO } from "../DAO/SqsDAO";
import { PostStatusMessage } from "../message/PostStatusMessage";
import {
  SQS_POST_STATUS_URL,
  SQS_UPDATE_FEED_URL,
} from "../DAO/DAOFactoryImpl";
import { UpdateFeedMessage } from "../message/UpdateFeedMessage";
import { FollowService } from "./FollowService";

export class MessageService implements Service {
  private sqsDAO: SqsDAO;

  constructor(daoFactory: DAOFactory) {
    this.sqsDAO = daoFactory.sqsDAO;
  }

  async sendPostStatusMessage(token: string, statusItem: StatusDTO) {
    const message: PostStatusMessage = {
      token: token,
      alias: statusItem.user.alias,
      status: statusItem,
    };
    await this.sqsDAO.sendMessage(SQS_POST_STATUS_URL, JSON.stringify(message)); //TODO make MessageDAO??
  }

  async sendUpdateFeedsMessages(
    token: string,
    alias: string,
    newStatus: StatusDTO,
    followService: FollowService
  ) {
    let hasMore: boolean = true;
    let aliases: string[] = [];
    let items: string[] = [];
    let lastUserItem: string | null = null;
    //let messageBody: UpdateFeedMessage;
    while (hasMore === true) {
      //const startTimeMillis = new Date().getTime();
      //while (aliases.length < 51 && hasMore) {
      [items, hasMore] = await followService.loadFollowerBatch(
        token,
        alias,
        100,
        lastUserItem
      );
      //console.log(hasMore);
      if (items.length > 0) {
        lastUserItem = items[items.length - 1];
      }
      for (let item of items) {
        aliases.push(item);
      }
      //await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      //}
      let messageBody: UpdateFeedMessage = {
        token: token,
        aliases: aliases,
        status: newStatus,
      };
      await this.sqsDAO.sendMessage(
        SQS_UPDATE_FEED_URL,
        JSON.stringify(messageBody)
      ); //TODO does this work??? is this wise???
      aliases = [];
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      /*
      const elapsedTime = new Date().getTime() - startTimeMillis;
      if (elapsedTime < 1000) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, 1000 - elapsedTime)
        );
      }
        */
    }
  }
}
