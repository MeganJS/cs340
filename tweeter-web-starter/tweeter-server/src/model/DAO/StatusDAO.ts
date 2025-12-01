import { StatusDTO } from "tweeter-shared";

export interface StatusDAO {
  putPostedStatus(alias: string, newStatus: StatusDTO): Promise<void>;
  putFollowedStatus(alias: string, newStatus: StatusDTO): Promise<void>;

  getStoryItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]>;

  getFeedItems(
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]>;
}

//user alias
//posts_made
//posts_followed
//could do an id system, but it's not required for the specs of this project
