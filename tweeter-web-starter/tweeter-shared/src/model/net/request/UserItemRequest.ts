import { TokenRequest } from "./TokenRequest";

export interface UserItemRequest extends TokenRequest {
  readonly alias: string;
}
