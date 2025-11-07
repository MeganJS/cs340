import { UserDTO } from "../../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface UserItemResponse extends TweeterResponse {
  readonly user: UserDTO | null;
}
