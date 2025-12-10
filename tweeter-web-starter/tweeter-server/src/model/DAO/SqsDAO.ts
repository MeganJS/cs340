import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class SqsDAO {
  static _instance: SqsDAO;
  private readonly client: SQSClient;

  constructor() {
    this.client = new SQSClient();
  }

  static get instance() {
    if (!SqsDAO._instance) {
      SqsDAO._instance = new SqsDAO();
    }
    return SqsDAO._instance;
  }

  async sendMessage(sqs_url: string, messageBody: string): Promise<void> {
    //const sqs_url =
    //  "https://sqs.us-west-2.amazonaws.com/649209434077/SQSExcercise";
    //const messageBody = "testing testing 123";

    const params = {
      DelaySeconds: 10,
      MessageBody: messageBody,
      QueueUrl: sqs_url,
    };

    try {
      const data = await SqsDAO.instance.client.send(
        new SendMessageCommand(params)
      );
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
      throw err;
    }
  }
}
