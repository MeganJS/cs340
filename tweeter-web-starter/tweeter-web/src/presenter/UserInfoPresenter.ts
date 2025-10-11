import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, time: number) => string;
  deleteMessage: (message: string) => void;
  setIsFollower: (value: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (value: boolean) => void;
}

export class UserInfoPresenter {
  private userService: UserService;
  private view: UserInfoView;

  public constructor(view: UserInfoView) {
    this.userService = new UserService();
    this.view = view;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFolloweeCount(
        await this.getFolloweeCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFollowerCount(
        await this.getFollowerCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async followDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    event.preventDefault();

    var followingUserToast = "";

    try {
      this.view.setIsLoading(true);
      followingUserToast = this.view.displayInfoMessage(
        `Following ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.follow(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
  }
  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    event.preventDefault();

    var unfollowingUserToast = "";

    try {
      this.view.setIsLoading(true);
      unfollowingUserToast = this.view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.unfollow(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
      this.view.setIsLoading(false);
    }
  }

  private async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    return await this.userService.unfollow(authToken, userToUnfollow);
  }

  private async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    return await this.userService.follow(authToken, userToFollow);
  }

  private async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await this.userService.getFolloweeCount(authToken, user);
  }

  private async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return await this.userService.getFollowerCount(authToken, user);
  }

  private async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return await this.userService.getIsFollowerStatus(
      authToken,
      user,
      selectedUser
    );
  }
}
