import { AuthTokenDTO } from "../../dto/AuthTokenDTO";
import { UserDTO } from "../../dto/UserDTO";
import { TweeterResponse } from "./TweeterResponse";

export interface AuthResponse extends TweeterResponse {
  readonly user: UserDTO | null;
  readonly authToken: AuthTokenDTO | null;
}
