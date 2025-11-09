import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected itemDescription(): string {
    return "load followees";
  }

  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    return await this.service.loadMoreFollowItems(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem,
      "followee"
    );
  }
  /*
  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.service.loadMoreFollowees(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null; //what if newItems is empty? better be careful!
      this.view.addItems(newItems);
    }, "load followees");
  }
    */
}
