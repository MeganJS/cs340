import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model.service/StatusService";
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
  let mockService: StatusService;

  const authToken: AuthToken = new AuthToken("abc123", Date.now());
  const postString: string = "new post string";

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageId123"
    );

    const spyPostStatusPresenter = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    mockService = mock<StatusService>();
    when(spyPostStatusPresenter.statusService).thenReturn(
      instance(mockService)
    );

    spyPostStatusPresenterInstance = instance(spyPostStatusPresenter);
  });

  it("tells the view to display a posting status message", async () => {
    await spyPostStatusPresenterInstance.submitPost(
      postString,
      anything(),
      authToken
    );
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await spyPostStatusPresenterInstance.submitPost(
      postString,
      anything(),
      authToken
    );
    verify(mockService.postStatus(authToken, anything())).once();

    let [capturedAuth, capturedStatus] = capture(mockService.postStatus).last(); //returns parameters from last call of logout, [] desctructures
    expect(capturedStatus.post).toEqual(postString);
  });

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message", async () => {
    await spyPostStatusPresenterInstance.submitPost(
      postString,
      anything(),
      authToken
    );

    verify(mockPostStatusView.deleteMessage("messageId123")).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000));

    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it(" tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message", async () => {
    let error = new Error("A (mock) error occurred");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);

    await spyPostStatusPresenterInstance.submitPost(
      postString,
      anything(),
      authToken
    );

    verify(
      mockPostStatusView.displayInfoMessage(anything(), anything())
    ).once();
    verify(mockPostStatusView.deleteMessage("messageId123")).once();
    verify(
      mockPostStatusView.displayErrorMessage(
        `Failed to post the status because of exception: ${error.message}`
      )
    ).once();
    verify(mockPostStatusView.setPost(anything())).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).never();

    let [capturedErrorString] = capture(
      mockPostStatusView.displayErrorMessage
    ).last();
    console.log(capturedErrorString);
  });
});
