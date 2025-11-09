import { UserDTO } from "../../dto/UserDTO";
import { PagedItemResponse } from "./PagedItemResponse";

export interface PagedUserItemResponse extends PagedItemResponse<UserDTO> {
  readonly items: UserDTO[] | null;
}
