import { TokenRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";

export const handler = async (
  request: TokenRequest
): Promise<TweeterResponse> => {
  const userService: UserService = new UserService(DAOFactoryImpl.instance);

  await userService.logout(request.token);

  return {
    success: true,
    message: null,
  };
};
