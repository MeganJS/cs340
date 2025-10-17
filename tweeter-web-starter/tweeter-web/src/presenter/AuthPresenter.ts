import { User, AuthToken } from "tweeter-shared";
import { NavView, Presenter } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface AuthView extends NavView {
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
}

export abstract class AuthPresenter<V extends AuthView> extends Presenter<V> {
  protected userService: UserService = new UserService();

  /*
  public constructor(view: V) {
    super(view);
    this.userService = new UserService();
  }
    */

  public async doAuth(
    authAction: () => Promise<[User, AuthToken]>,
    navigateNextPage: (userAlias: string) => void,
    rememberMe: boolean,
    itemDescription: string
  ) {
    await this.doFailureReportingFinallyOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await authAction();

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        navigateNextPage(user.alias);
      },
      itemDescription,
      () => {
        this.view.setIsLoading(false);
      }
    );
  }
}
