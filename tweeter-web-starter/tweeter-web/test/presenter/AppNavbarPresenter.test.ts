import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenter/AppNavbarPresenter";
import { UserService } from "../../src/model.service/UserService";
import { AuthToken } from "tweeter-shared";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarView: AppNavbarView;
  let spyAppNavbarPresenterInstance: AppNavbarPresenter;
  let mockService: UserService;

  const authToken: AuthToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockAppNavbarView = mock<AppNavbarView>();
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);
    when(mockAppNavbarView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageId123"
    );

    const spyAppNavbarPresenter = spy(
      new AppNavbarPresenter(mockAppNavbarViewInstance)
    );
    spyAppNavbarPresenterInstance = instance(spyAppNavbarPresenter);
    //appNavbarPresenter = new AppNavbarPresenter(mockAppNavbarViewInstance);

    mockService = mock<UserService>();
    //const mockServiceInstance = instance(mockService);
    when(spyAppNavbarPresenter.userService).thenReturn(instance(mockService));
  });

  it("tells the view to display a logging out message", async () => {
    await spyAppNavbarPresenterInstance.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await spyAppNavbarPresenterInstance.logOut(authToken);
    verify(mockService.logout(authToken)).once();

    let [capturedAuthToken] = capture(mockService.logout).last(); //returns parameters from last call of logout, [] desctructures
    expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the info message that was displayed previously, clear user info, and navigate to the login page", async () => {
    await spyAppNavbarPresenterInstance.logOut(authToken);

    verify(mockAppNavbarView.deleteMessage("messageId123")).once();
    verify(mockAppNavbarView.clearUserInfo()).once();
    verify(mockAppNavbarView.navigate(anything())).once();

    verify(mockAppNavbarView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page.", async () => {
    let error = new Error("A (mock) error occurred");
    when(mockService.logout(anything())).thenThrow(error);

    await spyAppNavbarPresenterInstance.logOut(authToken);

    verify(
      mockAppNavbarView.displayErrorMessage(
        `Failed to log user out because of exception: ${error.message}`
      )
    ).once();
    verify(mockAppNavbarView.deleteMessage(anything())).never();
    verify(mockAppNavbarView.clearUserInfo()).never();
    verify(mockAppNavbarView.navigate("/login")).never();

    let [capturedErrorString] = capture(
      mockAppNavbarView.displayErrorMessage
    ).last();
    console.log(capturedErrorString);
  });
});
