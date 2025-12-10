import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";
import { UpdateFeedMessage } from "../../model/message/UpdateFeedMessage";
import { StatusService } from "../../model/service/StatusService";

export const handler = async function (event: any) {
  const statusService = new StatusService(DAOFactoryImpl.instance);

  for (let i = 0; i < event.Records.length; ++i) {
    const startTimeMillis = new Date().getTime();

    const { body } = event.Records[i];
    console.log(body);
    const body_parsed: UpdateFeedMessage = JSON.parse(body);

    await statusService.updateFeedsFromList(
      body_parsed.token,
      body_parsed.aliases,
      body_parsed.status
    );

    /*
    let aliases: string[] = body_parsed.aliases;
    let itemsToSend: string[] = [];
    let sendMore: boolean = aliases.length > 0;
    while (sendMore) {
      if (aliases.length < 26) {
        await statusService.updateFeeds(
          body_parsed.token,
          aliases,
          body_parsed.status
        );

        sendMore = false;
        break;
      }
      itemsToSend = aliases.slice(0, 25);
      aliases = aliases.slice(25);
      await statusService.updateFeeds(
        body_parsed.token,
        itemsToSend,
        body_parsed.status
      );
      //TODO statusService batch update
      sendMore = aliases.length > 0;
    }
      */

    //ensure each loop takes 1 second at least
    const elapsedTime = new Date().getTime() - startTimeMillis;
    if (elapsedTime < 1000) {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 1000 - elapsedTime)
      );
    }
  }
  return null;
};
