import { StatusDTO, UserDTO } from "tweeter-shared";

export interface UpdateFeedMessage {
  token: string;
  items: UserDTO[];
  status: StatusDTO;
}
