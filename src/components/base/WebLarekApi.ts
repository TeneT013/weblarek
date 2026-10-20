import {
  IApi,
  IOrderRequest,
  IOrderResult,
  IProductListResponse,
} from "../../types/index";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  /** Запрос массива товаров с сервера (вернуть когда поднимут api) */
  getProductList(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>("/product");
  }
  



  /** Отправка данных о заказе на сервер */
  orderProducts(order: IOrderRequest): Promise<IOrderResult> {
    return this.api.post<IOrderResult>("/order", order);
  }
}
