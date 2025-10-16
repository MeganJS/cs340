import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
  private _lastItem: Status | null = null;
  private _hasMoreItems: boolean = true;
  private userService: UserService;

  protected constructor(view: StatusItemView) {
    super(view);
    this._lastItem;
    this.userService = new UserService();
  }
  public get hasMoreItems() {
    return this._hasMoreItems;
  }
  public set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }
  public get lastItem() {
    return this._lastItem;
  }
  public set lastItem(value: Status | null) {
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

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
