import { StatusDTO, UserDTO } from "tweeter-shared";

export interface UpdateFeedMessage {
  token: string;
  aliases: string[];
  status: StatusDTO;
}
