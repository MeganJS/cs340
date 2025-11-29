import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";

export const handler = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const userService: UserService = new UserService(DAOFactoryImpl.instance);

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
};
