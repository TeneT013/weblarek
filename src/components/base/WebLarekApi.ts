import {
  IApi,
  IOrderRequest,
  IOrderResult,
  IProductListResponse,
} from "../../types/index";

export class WebLarekApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  /** Запрос массива товаров с сервера (вернуть когда поднимут api) */
  getProductList(): Promise<IProductListResponse> {
    return this._api.get<IProductListResponse>("/product");
  }
  



  /** Отправка данных о заказе на сервер */
  orderProducts(order: IOrderRequest): Promise<IOrderResult> {
    return this._api.post<IOrderResult>("/order", order);
  }
}
