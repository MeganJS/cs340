import { StatusDTO } from "../../dto/StatusDTO";
import { TokenRequest } from "./TokenRequest";

export interface StatusItemRequest extends TokenRequest {
  readonly statusItem: StatusDTO;
}
