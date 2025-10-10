import { Toast } from "../components/toaster/Toast";

export interface ToasterView {
  deleteMessage: (messageID: string) => void;
}

export class ToasterPresenter {
  private view: ToasterView;
  public constructor(view: ToasterView) {
    this.view = view;
  }

  public deleteExpiredToasts(messageList: Toast[]) {
    const now = Date.now();

    for (let message of messageList) {
      if (
        message.expirationMillisecond > 0 &&
        message.expirationMillisecond < now
      ) {
        this.view.deleteMessage(message.id);
      }
    }
  }
}
