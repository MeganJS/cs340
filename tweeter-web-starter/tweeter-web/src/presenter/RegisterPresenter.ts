import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView {
  setImageUrl: (imageURL: string) => void;
  setImageFileExtension: (fileExt: string) => void;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  private _imageBytes: Uint8Array = new Uint8Array();

  /*
  public constructor(view: RegisterView) {
    super(view);
    this._imageBytes = new Uint8Array();
  }
    */

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this._imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this._imageBytes = new Uint8Array();
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    rememberMe: boolean,
    imageFileExtension: string
  ) {
    await this.doAuth(
      async () => {
        return await this.register(
          //does this need to be awaited?
          firstName,
          lastName,
          alias,
          password,
          imageFileExtension
        );
      },
      (userAlias: string) => {
        this.view.navigate(`/feed/${userAlias}`);
      },
      rememberMe,
      "register user"
    );
    /*
    await this.doFailureReportingFinallyOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this.register(
          firstName,
          lastName,
          alias,
          password,
          imageFileExtension
        );

        this.view.updateUserInfo(user, user, authToken, rememberMe);
        this.view.navigate(`/feed/${user.alias}`);
      },
      "register user",
      () => {
        this.view.setIsLoading(false);
      }
    );
    */
  }

  private async register(
    alias: string,
    password: string,
    firstName: string,
    lastName: string,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    return await this.userService.register(
      firstName,
      lastName,
      alias,
      password,
      this._imageBytes,
      imageFileExtension
    );
  }

  public checkSubmitButtonStatus(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string
  ): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  }
}
