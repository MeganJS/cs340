import { StatusDTO } from "tweeter-shared";

export interface PostStatusMessage {
  token: string;
  alias: string;
  status: StatusDTO;
}
