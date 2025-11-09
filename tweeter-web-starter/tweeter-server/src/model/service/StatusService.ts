import { FakeData, Status } from "tweeter-shared";
import { Service } from "./Service";
import { StatusDTO } from "tweeter-shared";

export class StatusService implements Service {
  public async loadMoreFeedItems(
    token: string,
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    return await this.getFakeData(pageSize, lastItem);
  }

  public async loadMoreStoryItems(
    token: string,
    alias: string,
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    // TODO: Replace with the result of calling server
    return await this.getFakeData(pageSize, lastItem);
  }

  private async getFakeData(
    pageSize: number,
    lastItem: StatusDTO | null
  ): Promise<[StatusDTO[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDTO(lastItem),
      pageSize
    );

    const dtos = items.map((status) => status.DTO);
    return [dtos, hasMore];
  }

  public async postStatus(token: string, newStatus: StatusDTO): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
    // TODO: Call the server to post the status
  }
}
