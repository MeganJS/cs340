import { StatusDTO } from "../../dto/StatusDTO";
import { TweeterRequest } from "./TweeterRequest";

export interface StatusItemRequest extends TweeterRequest {
  readonly statusItem: StatusDTO;
}
