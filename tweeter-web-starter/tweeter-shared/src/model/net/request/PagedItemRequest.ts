import { UserItemRequest } from "./UserItemRequest";

export interface PagedItemRequest<T> extends UserItemRequest {
  readonly pageSize: number;
  readonly lastItem: T | null;
}
