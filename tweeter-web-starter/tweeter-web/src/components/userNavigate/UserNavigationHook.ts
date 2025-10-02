import { AuthToken, User, FakeData } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useNavigate } from "react-router-dom";

interface UserNavigator {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

export const useUserNavigation = (): UserNavigator => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();

  return {
    navigateToUser: async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();

      try {
        const alias = extractAlias(event.target.toString());
        const url = extractURL(event.target.toString());
        const toUser = await getUser(authToken!, alias);

        if (toUser) {
          if (!toUser.equals(displayedUser!)) {
            setDisplayedUser(toUser);
            navigate(`${url}/${toUser.alias}`);
          }
        }
      } catch (error) {
        displayErrorMessage(
          `Failed to get user because of exception: ${error}`
        );
      }
    },
  };
};

const extractAlias = (value: string): string => {
  const index = value.indexOf("@");
  return value.substring(index);
};

const extractURL = (value: string): string => {
  const pieces = value.split("/");
  return `/${pieces[3]}`;
};

const getUser = async (
  authToken: AuthToken,
  alias: string
): Promise<User | null> => {
  // TODO: Replace with the result of calling server
  return FakeData.instance.findUserByAlias(alias);
};
