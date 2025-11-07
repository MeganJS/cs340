import { StatusDTO } from "../../dto/StatusDTO";
import { PagedItemResponse } from "./PagedItemResponse";

export interface PagedStatusItemResponse extends PagedItemResponse {
  readonly items: StatusDTO[] | null;
}
