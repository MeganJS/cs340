import { AuthResponse, RegisterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";

export const handler = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const userService: UserService = new UserService(DAOFactoryImpl.instance);

  try {
    const [user, authToken] = await userService.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.imageStringBase64,
      request.imageFileExtension
    );

    return {
      success: true,
      message: null,
      user: user,
      authToken: authToken,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      user: null,
      authToken: null,
    };
  }
};
