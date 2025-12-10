import { DAOFactoryImpl } from "../../model/DAO/DAOFactoryImpl";
import { FollowService } from "../../model/service/FollowService";

export const handler = async function (event: any) {
  const followService = new FollowService(DAOFactoryImpl.instance);

  for (let i = 0; i < event.Records.length; ++i) {
    const startTimeMillis = new Date().getTime();

    const { body } = event.Records[i];
    // TODO: Add code to print message body to the log.
    console.log(body);

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
