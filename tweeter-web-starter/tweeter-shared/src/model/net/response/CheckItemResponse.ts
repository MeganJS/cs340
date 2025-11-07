import { TweeterResponse } from "./TweeterResponse";

export interface CheckItemResponse extends TweeterResponse {
  readonly checkResult: boolean;
}
