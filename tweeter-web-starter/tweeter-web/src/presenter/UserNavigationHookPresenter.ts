import { User, AuthToken, FakeData } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationHookView {
  setDisplayedUser: (user: User) => void;
  navigate: (navUrl: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationHookPresenter {
  private view: UserNavigationHookView;
  private userService: UserService;

  public constructor(view: UserNavigationHookView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    displayedUser: User,
    authToken: AuthToken
  ): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());
      const url = this.extractURL(event.target.toString());
      const toUser = await this.getUser(authToken, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${url}/${toUser.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
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
    return this.userService.getUser(authToken, alias);
  }
}
