import {IProduct} from '../../../types/index'

export class BasketProduct {
  private _items: IProduct[];

  constructor() {
    this._items = [];
  }

   /** Добавляет полученный товар в массив корзины */
  add(item: IProduct): void {
    this._items.push(item);
  }

  /** Возвращает массив товаров, находящихся в корзине */
  getItems(): IProduct[] {
    return this._items;
  }

  /** Удаляет товар из массива корзины по его id */
  remove(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
  }

  /** Полностью очищает корзину */
  clear(): void {
    this._items = [];
  }

  /** Вычисляет и возвращает общую стоимость всех товаров в корзине */
  getTotalPrice(): number {
    return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  /** Возвращает общее количество товаров в корзине */
  getCount(): number {
    return this._items.length;
  }

  /** Проверяет наличие товара в корзине по его id */
  inBasket(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}