export const BUCKET: string = "cs340-tweeter-247";
export const REGION: string = "us-west-2";

export interface DataDAO {
  putData(requestParams: any): Promise<void>;
  deleteData(requestParams: any): Promise<void>;
  getData(requestParams: any): Promise<any>;
  updateData(requestParams: any): Promise<void>;
}
