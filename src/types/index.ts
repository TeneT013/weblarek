import { categoryMap } from "../utils/constants";

export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export type TCategory = keyof typeof categoryMap;

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: TCategory;
  price: number | null;
}

export type TPayment = "card" | "cash";

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IBuyer {
  payment: TPayment | "";
  email: string;
  phone: string;
  address: string;
}

export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}
