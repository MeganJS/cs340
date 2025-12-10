export interface DataDAO {
  putData(requestParams: any): Promise<void>;
  writeBatchData?(requestParams: any): Promise<any>;
  deleteData(requestParams: any): Promise<void>;
  getData(requestParams: any): Promise<any>;
  updateData(requestParams: any): Promise<void>;
  queryData?(requestParams: any): Promise<any>;
}
