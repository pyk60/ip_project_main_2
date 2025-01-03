import { SelectQueryBuilder } from 'typeorm';
import { PaginationQuery } from '../dto/pagination-query.dto';
import { FetchType, FetchResult } from '../classes/fetch-result';

export async function paginateEntities<T>(
  queryBuilder: SelectQueryBuilder<T>,
  pagination: PaginationQuery,
  fetchType: FetchType = FetchType.MANAGED,
): Promise<FetchResult<T>> {
  const { page, limit } = pagination;

  const take = limit > 100 || !limit ? 100 : limit;
  const skip = (page - 1) * take || 0;

  const totalItems = (await queryBuilder.clone().getCount()) || 0;
  const items = await (fetchType === FetchType.RAW
    ? queryBuilder.clone().offset(skip).limit(take).getRawMany()
    : queryBuilder.clone().offset(skip).limit(take).getMany());

  const itemCount = items.length;
  const itemsPerPage = Number(take);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Number(page) || 1;
  const meta = {
    itemCount,
    totalItems,
    itemsPerPage,
    totalPages,
    currentPage,
  };

  return {
    items,
    meta,
  };
}
