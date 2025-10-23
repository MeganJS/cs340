import { Status, AuthToken, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageLoadView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageLoadView {
  setPost: (post: string) => void;
  //setIsLoading: (value: boolean) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService = new StatusService();
  /*
  public constructor(view: PostStatusView) {
    super(view);
    this.statusService = new StatusService();
  }
    */
  /*
  public statusServiceFactory() {
    return new StatusService();
  }
    */

  public get statusService() {
    return this._statusService;
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    //event.preventDefault();
    var postingStatusToastId = "";

    await this.doFailureReportingFinallyOperation(
      async () => {
        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage(
          "Posting status...",
          0
        );

        const status = new Status(post, currentUser, Date.now());

        await this.postStatus(authToken, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
        this.view.deleteMessage(postingStatusToastId);
        this.view.setIsLoading(false);
      }
    );
  }

  public checkButtonStatus(
    post: string,
    authToken: AuthToken | null,
    currentUser: User | null
  ): boolean {
    return !post.trim() || !authToken || !currentUser;
  }

  private async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    await this.statusService.postStatus(authToken, newStatus);
  }
}
