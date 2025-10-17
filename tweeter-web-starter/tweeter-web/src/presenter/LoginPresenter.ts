import { User, AuthToken } from "tweeter-shared";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter<AuthView> {
  public async doLogin(
    alias: string,
    password: string,
    originalUrl: string | undefined,
    rememberMe: boolean
  ) {
    await this.doAuth(
      async () => {
        return await this.login(alias, password);
      },
      (userAlias: string) => {
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${userAlias}`);
        }
      },
      rememberMe,
      "log user in"
    );
    /*
    await this.doFailureReportingFinallyOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this.login(alias, password);

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      },
      "log user in",
      () => {
        this.view.setIsLoading(false);
      }
    );
    */
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
