import { AuthRequest, AuthResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: AuthRequest): Promise<AuthResponse> => {
  const userService: UserService = new UserService();

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
};
