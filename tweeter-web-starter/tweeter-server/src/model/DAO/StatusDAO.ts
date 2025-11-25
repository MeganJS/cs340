import { StatusDTO } from "tweeter-shared";

export interface StatusDAO {
  putStatus(token: string, newStatus: StatusDTO): Promise<void>;
  getStoryItems(
    token: string,
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]>;
  getFeedItems(
    token: string,
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]>;
}
