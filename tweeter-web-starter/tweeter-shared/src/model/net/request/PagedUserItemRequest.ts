import { UserDTO } from "../../dto/UserDTO";
import { UserItemRequest } from "./UserItemRequest";

export interface PagedUserItemRequest extends UserItemRequest {
  readonly pageSize: number;
  readonly lastItem: UserDTO | null;
}
