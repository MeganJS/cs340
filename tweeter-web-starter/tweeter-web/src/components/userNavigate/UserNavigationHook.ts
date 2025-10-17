import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import {
  UserNavigationHookPresenter,
  UserNavigationHookView,
} from "../../presenter/UserNavigationHookPresenter";

interface UserNavigator {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

export const useUserNavigation = (): UserNavigator => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();

  const observer: UserNavigationHookView = {
    setDisplayedUser: setDisplayedUser,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
  };

  const presenterRef = useRef<UserNavigationHookPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserNavigationHookPresenter(observer);
  }

  return {
    navigateToUser: async (event: React.MouseEvent): Promise<void> => {
      presenterRef.current!.navigateToUser(event, displayedUser!, authToken!);
    },
  };
};
