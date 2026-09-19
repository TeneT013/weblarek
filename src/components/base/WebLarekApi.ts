import { Api} from './Api'
import { IProduct, IOrderRequest, IOrderResult, IProductListResponse } from '../../types/index'

export class WebLarekApi {
  private _api: Api;
  private _cdn: string;

  constructor(api: Api, cdn: string) {
    this._api = api;
    this._cdn = cdn;
  }

  /** Запрос массива товаров с сервера */
  getProductList(): Promise<IProduct[]> {
    return this._api.get<IProductListResponse>('/product').then((data) =>
      data.items.map((item) => ({
        ...item,
        image: this._cdn + item.image,
      }))
    );
  }

  /** Отправка данных о заказе на сервер */
  orderProducts(order: IOrderRequest): Promise<IOrderResult> {
    return this._api.post<IOrderResult>('/order', order);
  }
}