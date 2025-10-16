export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, time: number) => string;
  deleteMessage: (message: string) => void;
}

export interface NavView extends View {
  navigate: (pathUrl: string) => void;
}

export abstract class Presenter<V extends View> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string
  ) {
    try {
      await operation();
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    }
  }

  protected async doFailureReportingFinallyOperation(
    tryOperation: () => Promise<void>,
    operationDescription: string,
    finallyOperation: () => void
  ) {
    try {
      await tryOperation();
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      finallyOperation();
    }
  }

  protected async doAuthenticationOperation() {}
}
