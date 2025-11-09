import { UserDTO } from "../../dto/UserDTO";
import { PagedItemRequest } from "./PagedItemRequest";

export interface PagedUserItemRequest extends PagedItemRequest<UserDTO> {
  readonly lastItem: UserDTO | null;
}
