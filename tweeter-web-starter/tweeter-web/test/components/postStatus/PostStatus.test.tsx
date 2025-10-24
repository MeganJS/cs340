import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockUser: User = mock<User>();
  const mockUserInstance = instance(mockUser);

  const mockAuthToken: AuthToken = mock<AuthToken>();
  const mockAuthTokenInstance = instance(mockAuthToken);
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("starts with Post Status and Clear buttons both disabled", () => {
    const { postStatusButton, clearStatusButton } =
      renderPostStatusAndGetElement();
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    const { user, postStatusButton, clearStatusButton, postStatusTextArea } =
      renderPostStatusAndGetElement();
    await user.type(postStatusTextArea, "hey red");

    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });

  it("disables both buttons when the text field is cleared", async () => {
    const { user, postStatusButton, clearStatusButton, postStatusTextArea } =
      renderPostStatusAndGetElement();

    await user.type(postStatusTextArea, "hey red");
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();

    await user.clear(postStatusTextArea);
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("calls presenter's postStatus method with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const postText = "hey red";

    const { user, postStatusButton, postStatusTextArea, clearStatusButton } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    await user.type(postStatusTextArea, postText);
    await user.click(postStatusButton);
    //verify(mockPresenter.submitPost(anything(), anything(), anything())).once();

    verify(
      mockPresenter.submitPost(
        postText,
        mockUserInstance,
        mockAuthTokenInstance
      )
    ).once();
  });

  it("clears text field when the clear button is pressed", async () => {
    const { user, postStatusButton, clearStatusButton, postStatusTextArea } =
      renderPostStatusAndGetElement();

    await user.type(postStatusTextArea, "hey red");
    await user.click(clearStatusButton);

    expect(postStatusTextArea).toHaveDisplayValue("");
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByLabelText("post status button");
  const clearStatusButton = screen.getByLabelText("clear status button");
  const postStatusTextArea = screen.getByLabelText("post status text area");

  return { user, postStatusButton, clearStatusButton, postStatusTextArea };
}
