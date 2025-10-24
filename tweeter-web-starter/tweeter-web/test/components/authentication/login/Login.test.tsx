import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("starts with sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables sign-in button when both the alias and password fields have text", async () => {
    const { user, aliasField, passwordField, signInButton } =
      renderLoginAndGetElement("/");

    await user.type(aliasField, "h");
    await user.type(passwordField, "hh");

    expect(signInButton).toBeEnabled();
  });

  it("disables sign-in button if either the alias or password field is cleared", async () => {
    const { user, aliasField, passwordField, signInButton } =
      renderLoginAndGetElement("/");

    await user.type(aliasField, "h");
    await user.type(passwordField, "hh");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();
    await user.type(aliasField, "h");

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();
    await user.type(passwordField, "hh");

    await user.clear(aliasField);
    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls presenter's login method with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const originalUrl = "http://somewhere.com";
    const alias = "@alias";
    const password = "superdupercooper";
    const rememberMe = false;
    const { user, aliasField, passwordField, signInButton } =
      renderLoginAndGetElement(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    expect(signInButton).toBeEnabled();
    await user.click(signInButton);

    verify(
      mockPresenter.doLogin(alias, password, originalUrl, rememberMe)
    ).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
}

function renderLoginAndGetElement(
  originalUrl: string,
  presenter?: LoginPresenter
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}
