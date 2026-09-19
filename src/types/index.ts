export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export type TCategory =
  | "софт-скил"
  | "другое"
  | "дополнительное"
  | "кнопка"
  | "хард-скил";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: TCategory | string;
  price: number | null;
}

export type TPayment = "card" | "cash" | "";

export interface IBuyer {
  payment: TPayment;
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
