export class DataPage<T> {
  values: T[];
  hasMorePages: boolean;

  constructor(values: T[], hasMore: boolean) {
    this.values = values;
    this.hasMorePages = hasMore;
  }
}
