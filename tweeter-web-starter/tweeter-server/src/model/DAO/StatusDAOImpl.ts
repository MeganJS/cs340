import { UserDTO, StatusDTO } from "tweeter-shared";
import { DataDAO } from "./DataDAO";
import { StatusDAO } from "./StatusDAO";

export class StatusDAOImpl implements StatusDAO {
  private readonly tableDAO: DataDAO;
  private readonly storyTableName = "statuses";
  private readonly feedTableName = "feeds";
  //private readonly indexName = "follows_index";
  private readonly userAttr = "user_alias";
  private readonly timeAttr = "timestamp";
  private readonly feedAttr = "followed_status";
  private readonly storyAttr = "posted_status";

  constructor(tables: DataDAO) {
    this.tableDAO = tables;
    //this.fileDAO = files;
  }

  async putPostedStatus(alias: string, newStatus: StatusDTO): Promise<void> {
    await this.putStatus(alias, newStatus, this.storyTableName, this.storyAttr);
  }

  async putFollowedStatus(alias: string, newStatus: StatusDTO): Promise<void> {
    await this.putStatus(alias, newStatus, this.feedTableName, this.feedAttr);
  }

  private async putStatus(
    alias: string,
    newStatus: StatusDTO,
    table: string,
    statusAttr: string
  ): Promise<void> {
    const params = {
      TableName: table,
      Item: {
        [this.userAttr]: alias,
        [this.timeAttr]: newStatus.timestamp,
        [statusAttr]: JSON.stringify(newStatus),
      },
    };
    await this.tableDAO.putData(params);
  }
}
