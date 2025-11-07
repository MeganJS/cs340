import { UserDTO } from "../../dto/UserDTO";
import { PagedItemRequest } from "./PagedItemRequest";

export interface PagedUserItemRequest extends PagedItemRequest {
  readonly lastItem: UserDTO | null;
}
