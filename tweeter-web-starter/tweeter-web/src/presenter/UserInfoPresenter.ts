import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (value: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (value: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private userService: UserService;

  public constructor(view: UserInfoView) {
    super(view);
    this.userService = new UserService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
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
    }, "determine follower status");
    /*
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
      */
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  }

  private async displayedUserFollowAction(
    event: React.MouseEvent,
    displayedUser: User,
    followAction: string,
    isFollower: boolean,
    itemDescription: string,
    followActionOperation: () => Promise<[number, number]>
  ) {
    event.preventDefault();
    var followActionToast = "";

    await this.doFailureReportingFinallyOperation(
      async () => {
        this.view.setIsLoading(true);
        followActionToast = this.view.displayInfoMessage(
          `${followAction} ${displayedUser!.name}...`,
          0
        );

        const [followerCount, followeeCount] = await followActionOperation();

        this.view.setIsFollower(isFollower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      itemDescription,
      () => {
        this.view.deleteMessage(followActionToast);
        this.view.setIsLoading(false);
      }
    );
  }

  public async followDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.displayedUserFollowAction(
      event,
      displayedUser,
      "Following",
      true,
      "follow user",
      async () => {
        return await this.follow(authToken, displayedUser);
      }
    );
    /*
    event.preventDefault();
    var followingUserToast = "";

    await this.doFailureReportingFinallyOperation(
      async () => {
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
      },
      "follow user",
      () => {
        this.view.deleteMessage(followingUserToast);
        this.view.setIsLoading(false);
      }
    );
*/
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.displayedUserFollowAction(
      event,
      displayedUser,
      "Unfollowing",
      false,
      "unfollow user",
      async () => {
        return await this.unfollow(authToken, displayedUser);
      }
    );
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
