import { TweeterRequest } from "./TweeterRequest";

export interface UserItemRequest extends TweeterRequest {
  readonly alias: string;
}
