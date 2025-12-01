import { AuthRequest, AuthResponse, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";

export const handler = async (request: AuthRequest): Promise<AuthResponse> => {
  const userService: UserService = new UserService(DAOFactoryImpl.instance);

  try {
    const [user, authToken] = await userService.login(
      request.alias,
      request.password
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
