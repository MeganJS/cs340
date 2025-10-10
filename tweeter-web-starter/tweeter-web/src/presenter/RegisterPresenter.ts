import { Buffer } from "buffer";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface RegisterView {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (pathUrl: string) => void;
  displayErrorMessage: (message: string) => void;
  setImageUrl: (imageURL: string) => void;
  setImageFileExtension: (fileExt: string) => void;
  setIsLoading: (value: boolean) => void;
}

export class RegisterPresenter {
  private userService: UserService;
  private view: RegisterView;
  private _imageBytes: Uint8Array;

  public constructor(view: RegisterView) {
    this.userService = new UserService();
    this.view = view;
    this._imageBytes = new Uint8Array();
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      //this._imageURL = URL.createObjectURL(file);
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
        //setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        //this._imageFileExtension = fileExtension;
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      //this._imageURL = "";
      this.view.setImageUrl("");
      this._imageBytes = new Uint8Array();
      //setImageBytes(new Uint8Array());
    }
  }
  //

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
    try {
      //this._isLoading = true;
      this.view.setIsLoading(true);

      const [user, authToken] = await this.register(
        firstName,
        lastName,
        alias,
        password,
        this._imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      //this._isLoading = false;
      this.view.setIsLoading(false);
    }
  }

  private async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    return this.userService.register(
      firstName,
      lastName,
      alias,
      password,
      userImageBytes,
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
