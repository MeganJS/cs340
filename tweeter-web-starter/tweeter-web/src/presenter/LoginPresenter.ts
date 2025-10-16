import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { View, Presenter, NavView } from "./Presenter";

export interface LoginView extends NavView {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  //navigate: (pathUrl: string) => void;
  //displayErrorMessage: (message: string) => void;
  setIsLoading: (value: boolean) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private userService: UserService;
  //private view: LoginView;

  public constructor(view: LoginView) {
    super(view);
    this.userService = new UserService();
    //this.view = view;
  }

  public async doLogin(
    alias: string,
    password: string,
    originalUrl: string | undefined,
    rememberMe: boolean
  ) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return await this.userService.login(alias, password);
  }

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  }
}
