import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserItemView extends View {
  addItems: (items: User[]) => void;
  //displayErrorMessage: (message: string) => void; //now inherited from View interface
}
export abstract class UserItemPresenter extends Presenter<UserItemView> {
  //private _view: UserItemView;
  private _hasMoreItems = true;
  private _lastItem: User | null = null;
  private userService: UserService;

  protected constructor(view: UserItemView) {
    super(view);
    //this._view = view;
    this.userService = new UserService();
  }
  /*
  protected get view() {
    return this._view;
  }
    */

  public get hasMoreItems() {
    return this._hasMoreItems;
  }
  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem() {
    return this._lastItem;
  }
  protected set lastItem(value: User | null) {
    this._lastItem = value;
  }

  reset() {
    this.lastItem = null;
    this.hasMoreItems = true;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.userService.getUser(authToken, alias);
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
