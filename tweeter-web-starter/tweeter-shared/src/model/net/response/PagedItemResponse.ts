import { TweeterResponse } from "./TweeterResponse";

export interface PagedItemResponse<T> extends TweeterResponse {
  readonly hasMore: boolean;
  readonly items: T[] | null;
}
