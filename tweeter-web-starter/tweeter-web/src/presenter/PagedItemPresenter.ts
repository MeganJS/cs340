import { AuthToken, User } from "tweeter-shared";
import { View, Presenter } from "./Presenter";

export interface PagedItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export abstract class PagedItemPresenter<T> extends Presenter<
  PagedItemView<T>
> {
  private _lastItem: T | null = null;
  private _hasMoreItems: boolean = true;
  private userService: UserService = new UserService();

  public get hasMoreItems() {
    return this._hasMoreItems;
  }
  public set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }
  public get lastItem() {
    return this._lastItem;
  }
  public set lastItem(value: T | null) {
    this._lastItem = value;
  }

  public async reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.userService.getUser(authToken, alias);
  }

  //public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
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
}
