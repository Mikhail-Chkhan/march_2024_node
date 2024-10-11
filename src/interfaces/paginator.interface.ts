import { UserListOrderByEnum } from "../enums/user-list-order-by.enum";

export interface IPaginatorResponse<T> {
  data: T[];
  total: number;
  orderBy: UserListOrderByEnum;
  order: string;
  limit: number;
  page: number;
}
