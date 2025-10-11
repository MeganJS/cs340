import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  //TODO: moveover????
  //
  const checkSubmitButtonStatus = (): boolean => {
    return presenter.current!.checkSubmitButtonStatus(alias, password);
    //return !alias || !password;
  };
  //

  const observer: LoginView = {
    updateUserInfo: updateUserInfo,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
    setIsLoading: setIsLoading,
  };

  //const presenter = new LoginPresenter(observer);
  const presenter = useRef<LoginPresenter | null>(null);
  if (!presenter.current) {
    presenter.current = new LoginPresenter(observer);
  }

  const doLogin = async () => {
    presenter.current!.doLogin(alias, password, props.originalUrl, rememberMe);
  };

  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationFields
          doAuth={doLogin}
          checkSubmitButtonStatus={checkSubmitButtonStatus}
          setAlias={setAlias}
          setPassword={setPassword}
        />
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
