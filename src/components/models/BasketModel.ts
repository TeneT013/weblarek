import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class BasketModel {
  private items: IProduct[];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events
    this.items = [];
  }

  /** Добавляет полученный товар в массив корзины */
  add(item: IProduct): void {
    this.items.push(item);
    this.events.emit('basket:changed');
  }

  /** Возвращает массив товаров, находящихся в корзине */
  getItems(): IProduct[] {
    return this.items;
  }

  /** Удаляет товар из массива корзины по его id */
  remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit('basket:changed');
  }

  /** Полностью очищает корзину */
  clear(): void {
    this.items = [];
    this.events.emit('basket:changed');
  }

  /** Вычисляет и возвращает общую стоимость всех товаров в корзине */
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  /** Возвращает общее количество товаров в корзине */
  getCount(): number {
    return this.items.length;
  }

  /** Проверяет наличие товара в корзине по его id */
  isInBasket(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
