import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AppNavbarView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, time: number) => string;
  deleteMessage: (message: string) => void;
  navigate: (pathUrl: string) => void;
  clearUserInfo: () => void;
}

export class AppNavbarPresenter {
  private userService: UserService;
  private view: AppNavbarView;

  public constructor(view: AppNavbarView) {
    this.userService = new UserService();
    this.view = view;
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }

  private async logout(authToken: AuthToken): Promise<void> {
    this.userService.logout(authToken);
  }
}
