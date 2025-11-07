import { UserDTO } from "../../dto/UserDTO";
import { FollowActionRequest } from "./FollowActionRequest";

export interface CheckFollowerRequest extends FollowActionRequest {
  readonly selectedUser: UserDTO;
}
