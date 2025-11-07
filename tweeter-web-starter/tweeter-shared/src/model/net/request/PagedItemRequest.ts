import { UserItemRequest } from "./UserItemRequest";

export interface PagedItemRequest extends UserItemRequest {
  readonly pageSize: number;
}
