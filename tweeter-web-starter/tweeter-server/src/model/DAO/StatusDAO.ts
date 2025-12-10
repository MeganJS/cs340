import { StatusDTO } from "tweeter-shared";

export interface StatusDAO {
  putPostedStatus(alias: string, newStatus: StatusDTO): Promise<void>;
  putFollowedStatus(alias: string, newStatus: StatusDTO): Promise<void>;

  putFollowedStatusBatch(
    aliases: string[],
    newStatus: StatusDTO
  ): Promise<void>;

  getPageOfStoryItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | undefined
  ): Promise<[StatusDTO[], boolean]>;

  getPageOfFeedItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | undefined
  ): Promise<[StatusDTO[], boolean]>;
}
