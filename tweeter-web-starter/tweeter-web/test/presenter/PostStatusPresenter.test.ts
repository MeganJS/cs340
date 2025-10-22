import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
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

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let spyPostStatusPresenterInstance: PostStatusPresenter;
  let mockService: UserService;

  const authToken: AuthToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageId123"
    );

    const spyPostStatusPresenter = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    spyPostStatusPresenterInstance = instance(spyPostStatusPresenter);
    //appNavbarPresenter = new AppNavbarPresenter(mockAppNavbarViewInstance);

    mockService = mock<UserService>();
    //const mockServiceInstance = instance(mockService);
    when(spyPostStatusPresenter.userService).thenReturn(instance(mockService));
  });

  it("tells the view to display a logging out message", async () => {
    await spyPostStatusPresenterInstance.logOut(authToken);
    verify(mockPostStatusView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await spyPostStatusPresenterInstance.logOut(authToken);
    verify(mockService.logout(authToken)).once();

    let [capturedAuthToken] = capture(mockService.logout).last(); //returns parameters from last call of logout, [] desctructures
    expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the info message that was displayed previously, clear user info, and navigate to the login page", async () => {
    await spyPostStatusPresenterInstance.logOut(authToken);

    verify(mockPostStatusView.deleteMessage("messageId123")).once();
    verify(mockPostStatusView.clearUserInfo()).once();
    verify(mockPostStatusView.navigate(anything())).once();

    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page.", async () => {
    let error = new Error("A (mock) error occurred");
    when(mockService.logout(anything())).thenThrow(error);

    await spyPostStatusPresenterInstance.logOut(authToken);

    verify(
      mockPostStatusView.displayErrorMessage(
        `Failed to log user out because of exception: ${error.message}`
      )
    ).once();
    verify(mockPostStatusView.deleteMessage(anything())).never();
    verify(mockPostStatusView.clearUserInfo()).never();
    verify(mockPostStatusView.navigate("/login")).never();

    let [capturedErrorString] = capture(
      mockPostStatusView.displayErrorMessage
    ).last();
    console.log(capturedErrorString);
  });
});
