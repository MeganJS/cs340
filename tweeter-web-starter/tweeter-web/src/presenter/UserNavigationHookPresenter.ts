import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { NavView, Presenter } from "./Presenter";

export interface UserNavigationHookView extends NavView {
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationHookPresenter extends Presenter<UserNavigationHookView> {
  private userService: UserService = new UserService();
  /*
  public constructor(view: UserNavigationHookView) {
    super(view);
    this.userService = new UserService();
  }
    */

  public async navigateToUser(
    event: React.MouseEvent,
    displayedUser: User,
    authToken: AuthToken
  ): Promise<void> {
    event.preventDefault();
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());
      const url = this.extractURL(event.target.toString());
      const toUser = await this.getUser(authToken, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${url}/${toUser.alias}`);
        }
      }
    }, "get user");
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  private extractURL(value: string): string {
    const pieces = value.split("/");
    return `/${pieces[3]}`;
  }

  private async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return await this.userService.getUser(authToken, alias);
  }
}
