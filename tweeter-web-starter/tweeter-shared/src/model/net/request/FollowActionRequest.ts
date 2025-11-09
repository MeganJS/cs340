import { UserDTO } from "../../dto/UserDTO";
import { TokenRequest } from "./TokenRequest";

export interface FollowActionRequest extends TokenRequest {
  readonly user: UserDTO;
}
