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
    let items: UserDTO[] = [];
    let lastUserItem: UserDTO | null = null;
    let messageBody: UpdateFeedMessage;
    while (hasMore) {
      while (aliases.length < 76 && hasMore) {
        [items, hasMore] = await followService.loadMoreFollowees(
          token,
          alias,
          25,
          lastUserItem
        );
        if (items.length > 0) {
          lastUserItem = items[items.length - 1];
        }
        for (let item of items) {
          aliases.push(item.alias);
        }
      }

      messageBody = {
        token: token,
        aliases: aliases,
        status: newStatus,
      };
      await this.sqsDAO.sendMessage(
        SQS_UPDATE_FEED_URL,
        JSON.stringify(messageBody)
      ); //TODO does this work??? is this wise???
      aliases = [];
    }
  }
}
