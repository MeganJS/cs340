import { UserDTO } from "../../dto/UserDTO";

export interface PagedUserItemRequest {
  readonly token: string;
  readonly alias: string;
  readonly pageSize: number;
  readonly lastItem: UserDTO | null;
}
