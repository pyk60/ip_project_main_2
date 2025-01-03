import { Pagination } from './pagination';

export enum FetchType {
  RAW = 'RAW',
  MANAGED = 'MANAGED',
}

export class FetchResult<T> {
  items: Array<Partial<T>>;
  meta: Pagination;
}
